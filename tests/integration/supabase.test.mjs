import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_TEST_URL;
const anonKey = process.env.SUPABASE_TEST_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceRoleKey) {
  throw new Error("Integration tests require SUPABASE_TEST_URL, SUPABASE_TEST_ANON_KEY, and SUPABASE_TEST_SERVICE_ROLE_KEY");
}

const testUrl = new URL(url);
const remoteAllowed = process.env.ALLOW_REMOTE_SUPABASE_TESTS === "true";
if (!remoteAllowed && !["127.0.0.1", "localhost"].includes(testUrl.hostname)) {
  throw new Error("Refusing to run integration tests against a remote Supabase project");
}

const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
const password = "Readymetry-test-password-42!";
const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const users = [];
let userOne;
let userTwo;
let clientOne;
let clientTwo;

async function createTestUser(label) {
  const email = `integration-${label}-${runId}@readymetry.local`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: `Integration ${label}` },
  });
  assert.ifError(error);
  users.push(data.user.id);
  return { id: data.user.id, email };
}

async function authenticatedClient(email) {
  const client = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await client.auth.signInWithPassword({ email, password });
  assert.ifError(error);
  return client;
}

before(async () => {
  userOne = await createTestUser("one");
  userTwo = await createTestUser("two");
  clientOne = await authenticatedClient(userOne.email);
  clientTwo = await authenticatedClient(userTwo.email);
});

after(async () => {
  for (const id of users.reverse()) await admin.auth.admin.deleteUser(id);
});

test("RLS prevents users from reading or escalating another profile", async () => {
  const { data, error } = await clientOne.from("user_profiles").select("id, role").eq("id", userTwo.id);
  assert.ifError(error);
  assert.deepEqual(data, []);

  const escalation = await clientOne.from("user_profiles").update({ subscription_tier: "workforce" }).eq("id", userOne.id);
  assert.ok(escalation.error, "a browser client must not update entitlement columns");
});

test("question prompts are readable but answer keys remain server-only", async () => {
  const prompt = await clientOne.from("questions").select("id, body, options").limit(1);
  assert.ifError(prompt.error);
  assert.ok(prompt.data.length > 0);

  const answerKey = await clientOne.from("questions").select("id, correct_answer").limit(1);
  assert.ok(answerKey.error, "correct answers must not be selectable by authenticated clients");
});

test("support tickets are user-owned and internal notes remain staff-only", async () => {
  const created = await clientOne.from("support_tickets").insert({
    user_id: userOne.id,
    subject: "Integration support request",
    category: "technical",
    message: "This is a deterministic integration test request.",
  }).select("id").single();
  assert.ifError(created.error);

  const otherUser = await clientTwo.from("support_tickets").select("id").eq("id", created.data.id);
  assert.ifError(otherUser.error);
  assert.deepEqual(otherUser.data, []);

  const privateNotes = await clientOne.from("support_tickets").select("id, internal_notes").eq("id", created.data.id);
  assert.ok(privateNotes.error, "authenticated clients must not read internal support notes");

  const forged = await clientOne.from("support_tickets").insert({
    user_id: userOne.id,
    subject: "Forged privileged fields",
    category: "technical",
    message: "A browser client must not set staff-owned support fields.",
    internal_notes: "user-controlled internal note",
  });
  assert.ok(forged.error);
});

test("exam access consumes paid credit before free access and can be refunded", async () => {
  const reset = await admin.from("user_profiles").update({
    subscription_tier: "starter",
    purchased_exam_credits: 1,
    free_exam_consumed: false,
  }).eq("id", userOne.id);
  assert.ifError(reset.error);

  const denied = await clientOne.rpc("consume_exam_access", { p_user_id: userOne.id });
  assert.ok(denied.error, "authenticated clients must not call entitlement functions");

  const paid = await admin.rpc("consume_exam_access", { p_user_id: userOne.id });
  assert.ifError(paid.error);
  assert.equal(paid.data, "credit");

  const free = await admin.rpc("consume_exam_access", { p_user_id: userOne.id });
  assert.ifError(free.error);
  assert.equal(free.data, "free");

  const exhausted = await admin.rpc("consume_exam_access", { p_user_id: userOne.id });
  assert.ok(exhausted.error);

  const refund = await admin.rpc("refund_exam_access", { p_user_id: userOne.id, p_access_type: "free" });
  assert.ifError(refund.error);
  const profile = await admin.from("user_profiles").select("free_exam_consumed").eq("id", userOne.id).single();
  assert.ifError(profile.error);
  assert.equal(profile.data.free_exam_consumed, false);
});

test("exam sessions, answers, and analytics remain isolated by user", async () => {
  const question = await admin.from("questions").select("id, certification_id, correct_answer").eq("review_status", "published").limit(1).single();
  assert.ifError(question.error);
  const session = await admin.from("exam_sessions").insert({
    user_id: userOne.id,
    certification_id: question.data.certification_id,
    exam_type: "practice",
    status: "completed",
    total_questions: 1,
    correct_answers: 1,
    score: 100,
    question_ids: [question.data.id],
    access_type: "free",
    completed_at: new Date().toISOString(),
  }).select("id").single();
  assert.ifError(session.error);
  const answer = await admin.from("user_answers").insert({
    session_id: session.data.id,
    question_id: question.data.id,
    selected_answer: question.data.correct_answer,
    is_correct: true,
    time_spent_seconds: 10,
  });
  assert.ifError(answer.error);

  const ownSession = await clientOne.from("exam_sessions").select("id, score").eq("id", session.data.id).single();
  assert.ifError(ownSession.error);
  assert.equal(ownSession.data.score, 100);
  const hiddenSession = await clientTwo.from("exam_sessions").select("id").eq("id", session.data.id);
  assert.ifError(hiddenSession.error);
  assert.deepEqual(hiddenSession.data, []);
  const hiddenAnswers = await clientTwo.from("user_answers").select("id").eq("session_id", session.data.id);
  assert.ifError(hiddenAnswers.error);
  assert.deepEqual(hiddenAnswers.data, []);

  const crossUserAnalytics = await clientTwo.rpc("get_readiness_score", {
    p_user_id: userOne.id,
    p_certification_id: question.data.certification_id,
  });
  assert.ok(crossUserAnalytics.error, "analytics RPCs must reject a different user ID");
});

test("exam lifecycle rejects malformed submissions and completes only once", async () => {
  const questions = await admin.from("questions")
    .select("id, certification_id, correct_answer")
    .eq("certification_id", "11111111-0000-0000-0000-000000000001")
    .eq("review_status", "published")
    .limit(2);
  assert.ifError(questions.error);
  assert.equal(questions.data.length, 2);
  assert.equal(questions.data[0].certification_id, questions.data[1].certification_id);

  const reset = await admin.from("user_profiles").update({
    subscription_tier: "starter",
    purchased_exam_credits: 2,
    free_exam_consumed: false,
  }).eq("id", userTwo.id);
  assert.ifError(reset.error);

  const deniedCreation = await clientTwo.rpc("create_exam_session_with_access", {
    p_user_id: userTwo.id,
    p_certification_id: questions.data[0].certification_id,
    p_exam_type: "practice",
    p_categories: [],
    p_question_ids: questions.data.map((question) => question.id),
  });
  assert.ok(deniedCreation.error, "session creation must remain server-only");

  const created = await admin.rpc("create_exam_session_with_access", {
    p_user_id: userTwo.id,
    p_certification_id: questions.data[0].certification_id,
    p_exam_type: "practice",
    p_categories: [],
    p_question_ids: questions.data.map((question) => question.id),
  });
  assert.ifError(created.error);
  assert.equal(created.data.access_type, "credit");

  const duplicateAnswers = questions.data.map((question) => ({
    questionId: questions.data[0].id,
    selectedAnswer: question.correct_answer,
    timeSpentSeconds: 5,
    confidenceLevel: "confident",
    flagged: false,
  }));
  const malformed = await admin.rpc("submit_exam_session_atomic", {
    p_user_id: userTwo.id,
    p_session_id: created.data.id,
    p_answers: duplicateAnswers,
    p_time_taken_seconds: 10,
  });
  assert.ok(malformed.error);
  const unchanged = await admin.from("exam_sessions").select("status").eq("id", created.data.id).single();
  assert.ifError(unchanged.error);
  assert.equal(unchanged.data.status, "in_progress");
  const noPartialAnswers = await admin.from("user_answers").select("id", { count: "exact", head: true }).eq("session_id", created.data.id);
  assert.ifError(noPartialAnswers.error);
  assert.equal(noPartialAnswers.count, 0);

  const answers = questions.data.map((question) => ({
    questionId: question.id,
    selectedAnswer: question.correct_answer,
    timeSpentSeconds: 5,
    confidenceLevel: "confident",
    flagged: false,
  }));
  const args = {
    p_user_id: userTwo.id,
    p_session_id: created.data.id,
    p_answers: answers,
    p_time_taken_seconds: 10,
  };
  const attempts = await Promise.all([admin.rpc("submit_exam_session_atomic", args), admin.rpc("submit_exam_session_atomic", args)]);
  const successes = attempts.filter((attempt) => !attempt.error);
  const failures = attempts.filter((attempt) => attempt.error);
  assert.equal(successes.length, 1);
  assert.equal(failures.length, 1);
  assert.deepEqual(successes[0].data, { sessionId: created.data.id, score: 100, correct: 2, total: 2 });

  const completed = await admin.from("exam_sessions").select("status, score, correct_answers").eq("id", created.data.id).single();
  assert.ifError(completed.error);
  assert.deepEqual(completed.data, { status: "completed", score: 100, correct_answers: 2 });
  const storedAnswers = await admin.from("user_answers").select("id", { count: "exact", head: true }).eq("session_id", created.data.id);
  assert.ifError(storedAnswers.error);
  assert.equal(storedAnswers.count, 2);

  const timed = await admin.rpc("create_exam_session_with_access", {
    p_user_id: userTwo.id,
    p_certification_id: questions.data[0].certification_id,
    p_exam_type: "timed_simulation",
    p_categories: [],
    p_question_ids: questions.data.map((question) => question.id),
  });
  assert.ifError(timed.error);
  const expire = await admin.from("exam_sessions").update({
    expires_at: new Date(Date.now() - 1000).toISOString(),
    progress: { answers: [questions.data[0].correct_answer, null] },
  }).eq("id", timed.data.id);
  assert.ifError(expire.error);
  const expiredSubmission = await admin.rpc("submit_exam_session_atomic", {
    p_user_id: userTwo.id,
    p_session_id: timed.data.id,
    p_answers: questions.data.map((question) => ({
      questionId: question.id,
      selectedAnswer: "",
      timeSpentSeconds: 5,
      confidenceLevel: null,
      flagged: false,
    })),
    p_time_taken_seconds: 180,
  });
  assert.ifError(expiredSubmission.error);
  assert.deepEqual(expiredSubmission.data, { sessionId: timed.data.id, score: 50, correct: 1, total: 2 });
});

test("Stripe fulfillment is idempotent", async () => {
  const reset = await admin.from("user_profiles").update({ purchased_exam_credits: 0 }).eq("id", userOne.id);
  assert.ifError(reset.error);
  const args = {
    p_event_id: `evt_${runId}`,
    p_event_type: "checkout.session.completed",
    p_user_id: userOne.id,
    p_product: "single_exam",
    p_customer_id: `cus_${runId}`,
    p_checkout_session_id: `cs_${runId}`,
    p_payment_intent_id: `pi_${runId}`,
    p_amount_total: 3900,
    p_currency: "usd",
  };

  const first = await admin.rpc("fulfill_stripe_purchase", args);
  assert.ifError(first.error);
  assert.equal(first.data, true);
  const replay = await admin.rpc("fulfill_stripe_purchase", args);
  assert.ifError(replay.error);
  assert.equal(replay.data, false);

  const profile = await admin.from("user_profiles").select("purchased_exam_credits").eq("id", userOne.id).single();
  assert.ifError(profile.error);
  assert.equal(profile.data.purchased_exam_credits, 1);

  const purchase = await admin.from("stripe_purchases")
    .select("id, amount_total, currency, payment_status, fulfillment_status, action_required")
    .eq("stripe_checkout_session_id", args.p_checkout_session_id)
    .single();
  assert.ifError(purchase.error);
  assert.equal(purchase.data.amount_total, 3900);
  assert.equal(purchase.data.fulfillment_status, "fulfilled");

  const refundArgs = {
    p_event_id: `evt_refund_${runId}`,
    p_event_type: "charge.refunded",
    p_object_id: `ch_${runId}`,
    p_payment_intent_id: args.p_payment_intent_id,
    p_charge_id: `ch_${runId}`,
    p_amount: 1000,
    p_currency: "usd",
    p_object_status: "partially_refunded",
  };
  const refund = await admin.rpc("record_stripe_lifecycle_event", refundArgs);
  assert.ifError(refund.error);
  assert.equal(refund.data, true);
  const duplicateRefund = await admin.rpc("record_stripe_lifecycle_event", refundArgs);
  assert.ifError(duplicateRefund.error);
  assert.equal(duplicateRefund.data, false);
  const refunded = await admin.from("stripe_purchases")
    .select("amount_refunded, payment_status, fulfillment_status, action_required")
    .eq("id", purchase.data.id)
    .single();
  assert.ifError(refunded.error);
  assert.deepEqual(refunded.data, {
    amount_refunded: 1000,
    payment_status: "partially_refunded",
    fulfillment_status: "requires_review",
    action_required: true,
  });

  const disputeBase = {
    p_object_id: `du_${runId}`,
    p_payment_intent_id: args.p_payment_intent_id,
    p_charge_id: `ch_${runId}`,
    p_amount: 2900,
    p_currency: "usd",
  };
  const disputed = await admin.rpc("record_stripe_lifecycle_event", {
    ...disputeBase,
    p_event_id: `evt_dispute_created_${runId}`,
    p_event_type: "charge.dispute.created",
    p_object_status: "needs_response",
  });
  assert.ifError(disputed.error);
  assert.equal(disputed.data, true);
  const won = await admin.rpc("record_stripe_lifecycle_event", {
    ...disputeBase,
    p_event_id: `evt_dispute_closed_${runId}`,
    p_event_type: "charge.dispute.closed",
    p_object_status: "won",
  });
  assert.ifError(won.error);
  assert.equal(won.data, true);
  const resolved = await admin.from("stripe_purchases")
    .select("payment_status, fulfillment_status, action_required")
    .eq("id", purchase.data.id)
    .single();
  assert.ifError(resolved.error);
  assert.deepEqual(resolved.data, { payment_status: "dispute_won", fulfillment_status: "fulfilled", action_required: false });

  const hiddenLedger = await clientOne.from("stripe_purchases").select("id");
  assert.ok(hiddenLedger.error, "payment records must remain server-only");
});

test("unmatched Stripe events are retained for reconciliation", async () => {
  const eventId = `evt_unmatched_${runId}`;
  const result = await admin.rpc("record_stripe_lifecycle_event", {
    p_event_id: eventId,
    p_event_type: "charge.dispute.created",
    p_object_id: `du_unmatched_${runId}`,
    p_payment_intent_id: `pi_unmatched_${runId}`,
    p_charge_id: `ch_unmatched_${runId}`,
    p_amount: 3900,
    p_currency: "usd",
    p_object_status: "needs_response",
  });
  assert.ifError(result.error);
  assert.equal(result.data, false);
  const event = await admin.from("stripe_payment_events").select("processing_status, purchase_id").eq("event_id", eventId).single();
  assert.ifError(event.error);
  assert.deepEqual(event.data, { processing_status: "unmatched", purchase_id: null });
});

test("workforce fulfillment creates the owner and invitation claims are private", async () => {
  const purchase = await admin.rpc("fulfill_stripe_purchase", {
    p_event_id: `evt_workforce_${runId}`,
    p_event_type: "checkout.session.completed",
    p_user_id: userOne.id,
    p_product: "workforce_5",
    p_customer_id: `cus_workforce_${runId}`,
    p_checkout_session_id: `cs_workforce_${runId}`,
    p_payment_intent_id: `pi_workforce_${runId}`,
    p_amount_total: 14900,
    p_currency: "usd",
  });
  assert.ifError(purchase.error);

  const org = await admin.from("workforce_organizations").select("id, seat_limit").eq("owner_user_id", userOne.id).single();
  assert.ifError(org.error);
  assert.equal(org.data.seat_limit, 5);
  const owner = await admin.from("workforce_members").select("role, status").eq("organization_id", org.data.id).eq("user_id", userOne.id).single();
  assert.ifError(owner.error);
  assert.deepEqual(owner.data, { role: "owner", status: "active" });

  const invitation = await admin.from("workforce_members").insert({
    organization_id: org.data.id,
    email: userTwo.email,
    role: "member",
    status: "pending",
  });
  assert.ifError(invitation.error);
  const denied = await clientTwo.rpc("claim_workforce_invitation", { p_user_id: userTwo.id, p_email: userTwo.email });
  assert.ok(denied.error, "invitation claims must remain server-only");

  const claim = await admin.rpc("claim_workforce_invitation", { p_user_id: userTwo.id, p_email: userTwo.email });
  assert.ifError(claim.error);
  assert.equal(claim.data, true);
  const member = await admin.from("workforce_members").select("status, user_id").eq("organization_id", org.data.id).eq("email", userTwo.email).single();
  assert.ifError(member.error);
  assert.deepEqual(member.data, { status: "active", user_id: userTwo.id });
});
