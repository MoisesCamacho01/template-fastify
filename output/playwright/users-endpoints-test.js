/* eslint-disable no-unused-expressions */
async page => {
  const baseUrl = 'http://localhost:4000/api/v1/users';
  const emailSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const createdEmail = `playwright-${emailSuffix}@example.com`;
  const putEmail = `playwright-put-${emailSuffix}@example.com`;

  async function request(method, url, body, headers = {}) {
    const response = await page.evaluate(
      async ({ method, url, body, headers }) => {
        const requestHeaders = { ...headers };
        const options = { method, headers: requestHeaders };

        if (body !== undefined) {
          requestHeaders['content-type'] = 'application/json';
          options.body = JSON.stringify(body);
        }

        const res = await fetch(url, options);
        const text = await res.text();
        let payload;
        try {
          payload = text ? JSON.parse(text) : null;
        } catch {
          payload = text;
        }

        return {
          status: res.status,
          ok: res.ok,
          payload,
        };
      },
      { method, url, body, headers },
    );

    return response;
  }

  const cleanupIds = ['ae0c5a36-f698-4af6-a1c6-da404925ac34'];
  const cleanup = [];
  for (const id of cleanupIds) {
    cleanup.push(await request('DELETE', `${baseUrl}/delete/${id}`));
  }

  const create = await request('POST', `${baseUrl}/create`, {
    email: createdEmail,
    password: 'Password123!',
    status: 'pending_verification',
  });

  const userId = create.payload?.body?.id;

  const put = await request('PUT', `${baseUrl}/put/${userId}`, {
    email: putEmail,
    password: 'Password456!',
    status: 'active',
  });

  const patch = await request('PATCH', `${baseUrl}/patch/${userId}`, {
    status: 'suspended',
  });

  const del = await request('DELETE', `${baseUrl}/delete/${userId}`);

  const list = await request('GET', `${baseUrl}/`, undefined, {
    apiKey: '123456',
  });

  const summary = {
    createdUserId: userId ?? null,
    createdEmail,
    putEmail,
    createStatus: create.status,
    putStatus: put.status,
    patchStatus: patch.status,
    deleteStatus: del.status,
    listStatus: list.status,
    deletedUserStillListed: Array.isArray(list.payload?.body)
      ? list.payload.body.some(user => user.id === userId)
      : null,
    cleanupStatuses: cleanup.map(result => result.status),
  };

  const failedStep = Object.entries({ create, put, patch, delete: del, list }).find(([, result]) => !result.ok);

  if (failedStep !== undefined) {
    return {
      passed: false,
      failedStep: failedStep[0],
      summary,
      responses: { create, put, patch, delete: del, list, cleanup },
    };
  }

  return {
    passed: summary.deletedUserStillListed === false,
    summary,
    responses: { create, put, patch, delete: del, list, cleanup },
  };
}
