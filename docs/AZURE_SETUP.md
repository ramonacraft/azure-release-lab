# Azure Pipelines setup

Plain-English setup so a change can move **PR smoke → staging → production approval**, with a **nightly** smoke and a **rollback** that reuses a green production stage.

You need:

1. A free **Azure DevOps** account
2. This GitHub repo connected to Azure Pipelines
3. A **Vercel** project for the site
4. Secrets stored in Azure (never in git)

This lab is **web only**. No iOS, Android, or CTV agents.

---

## Step 1 — Create a Vercel project

1. Open [vercel.com](https://vercel.com) and sign in.
2. Import `ramonacraft/azure-release-lab`.
3. Framework preset: Vite. Build command: `npm run build`. Output: `dist`.
4. You can leave Vercel auto-deploy **off** so Azure owns deploys.

Create a Vercel token:

1. Vercel → Account Settings → Tokens → Create
2. Copy once — paste into Azure as a secret

From the Vercel project settings, also note:

- **Org / team ID** (`VERCEL_ORG_ID`)
- **Project ID** (`VERCEL_PROJECT_ID`)

Staging uses a **preview** deploy. Production uses a **production** deploy. Same Vercel project, two Azure environments.

---

## Step 2 — Connect Azure Pipelines to GitHub

1. Open [dev.azure.com](https://dev.azure.com) and create (or open) an organization + project.
2. Pipelines → New pipeline → GitHub → select `azure-release-lab`.
3. Choose **Existing Azure Pipelines YAML file**.
4. Path: `azure-pipelines.yml`
5. Save (do not rely on the first run until secrets and environments are set).

---

## Step 3 — Add secret variables in Azure

Pipelines → your pipeline → Edit → Variables:

| Name | Secret? | Where it comes from |
|------|---------|---------------------|
| `VERCEL_TOKEN` | Yes | Vercel account token |
| `VERCEL_ORG_ID` | Yes | Vercel project settings |
| `VERCEL_PROJECT_ID` | Yes | Vercel project settings |

Mark each as **secret**. Never put these in the YAML file or commit them.

---

## Step 4 — Create Azure environments

Pipelines → **Environments** → New environment:

1. Name: `staging` (no approval needed)
2. Name: `production`

On **production** → Approvals and checks → **Approvals** → add yourself (or a group).

The YAML already points at those names:

- Deploy staging → environment `staging`
- Deploy production → environment `production`

Until production has an approval check, Azure will not pause. The pause is the human gate.

---

## Step 5 — Walk the path

### Pull request (expect no deploy)

1. Open a small PR against `main`.
2. Azure runs **Build and smoke** only.
3. Staging and production stages stay skipped.
4. Open the run → **Tests** tab. Playwright results should be there.

### Happy path on main (expect staging, then a wait)

1. Merge to `main` (or push a small change).
2. Smoke passes.
3. **Deploy staging** runs and publishes a Vercel preview. The site chip should read **staging**.
4. **Deploy production** waits for approval.
5. Approve in Azure. Production deploys. The production URL chip should read **production**.

### Failure path (expect a hold)

1. Azure → Pipelines → Run pipeline.
2. Turn **ON**: `Simulate a smoke failure (blocks deploy)`.
3. Expect: **Build and smoke** red → staging and production skipped.
4. Run again with the toggle **off** so main stays green.

Do not leave a failing test on `main`.

### Nightly (expect smoke only)

The pipeline has a 07:00 UTC schedule on `main`. That run should smoke-test and **not** deploy.

### Rollback (expect approval again)

1. Find a previous green run that already deployed production.
2. Open that run → rerun **Deploy production**.
3. Approve when Azure pauses.
4. Production returns to that known-good deploy.

---

## Step 6 — Live runs on the board (optional)

The dashboard calls `/api/runs`. That function reads Azure DevOps with a PAT **on the server**.

In Vercel → Project → Settings → Environment Variables:

| Name | Notes |
|------|--------|
| `AZURE_DEVOPS_ORG` | Org name from `dev.azure.com/ORG/...` |
| `AZURE_DEVOPS_PROJECT` | Azure project name |
| `AZURE_DEVOPS_PAT` | PAT with **Build (Read)** |
| `AZURE_PIPELINE_DEFINITION_ID` | Optional. From the pipeline URL `.../definitions/N` |

Redeploy so the API picks up the vars. The Recent runs badge should say **Live Azure**. Local `npm run dev` still uses demo rows when the API is missing.

---

## Troubleshooting

| Symptom | Try this |
|---------|----------|
| Staging deploys from a PR | Confirm deploy stages require `refs/heads/main` |
| Production never pauses | Add an Approvals check on the `production` environment |
| Tests tab is empty | Confirm `test-results/junit.xml` exists after smoke (CI reporter writes it) |
| Vercel auth error | Re-check secret names: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |
| `Could not retrieve Project Settings` | Start a **new** run from latest `main`. Do not click Rerun on an old red run. |
| Chip still says Local on a live URL | Staging must use preview build; production must use `--prod` |

---

## Security reminder

- Do not commit `.env` or tokens
- Rotate a token if it ever lands in chat logs or a screenshot
- Prefer Azure secret variables and Vercel env over putting credentials in scripts
