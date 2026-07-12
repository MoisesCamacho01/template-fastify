/* eslint-disable no-unused-expressions */
async page => {
  const usersBaseUrl = "http://localhost:4000/api/v1/users";
  const addressesBaseUrl = "http://localhost:4000/api/v1/addresses";
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  async function request(method, url, body, headers = {}) {
    return await page.evaluate(
      async ({ method, url, body, headers }) => {
        const requestHeaders = { ...headers };
        const options = { method, headers: requestHeaders };

        if (body !== undefined) {
          requestHeaders["content-type"] = "application/json";
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
  }

  const userCreate = await request("POST", `${usersBaseUrl}/create`, {
    email: `address-owner-${suffix}@example.com`,
    password: "Password123!",
    status: "active",
  });

  const userId = userCreate.payload?.body?.id;

  const addressCreate = await request("POST", `${addressesBaseUrl}/create`, {
    country: "Ecuador",
    state: "Pichincha",
    city: "Quito",
    zipCode: "170102",
    address: "Av. Amazonas N34-451",
    idUser: userId,
  });

  const addressId = addressCreate.payload?.body?.id;

  const addressPut = await request("PUT", `${addressesBaseUrl}/put/${addressId}`, {
    country: "Ecuador",
    state: "Guayas",
    city: "Guayaquil",
    zipCode: "090101",
    address: "Malecon Simon Bolivar 100",
    idUser: userId,
  });

  const addressPatch = await request("PATCH", `${addressesBaseUrl}/patch/${addressId}`, {
    city: "Samborondon",
    zipCode: "092301",
  });

  const addressDelete = await request("DELETE", `${addressesBaseUrl}/delete/${addressId}`);

  const addressList = await request("GET", `${addressesBaseUrl}/`, undefined, {
    apiKey: "123456",
  });

  const userCleanup = userId === undefined
    ? { status: 0, ok: false, payload: "User was not created" }
    : await request("DELETE", `${usersBaseUrl}/delete/${userId}`);

  const deletedAddressStillListed = Array.isArray(addressList.payload?.body)
    ? addressList.payload.body.some(address => address.id === addressId)
    : null;

  const summary = {
    userId: userId ?? null,
    addressId: addressId ?? null,
    userCreateStatus: userCreate.status,
    addressCreateStatus: addressCreate.status,
    addressPutStatus: addressPut.status,
    addressPatchStatus: addressPatch.status,
    addressDeleteStatus: addressDelete.status,
    addressListStatus: addressList.status,
    userCleanupStatus: userCleanup.status,
    deletedAddressStillListed,
  };

  const failedStep = Object.entries({
    userCreate,
    addressCreate,
    addressPut,
    addressPatch,
    addressDelete,
    addressList,
    userCleanup,
  }).find(([, result]) => !result.ok);

  return {
    passed: failedStep === undefined && deletedAddressStillListed === false,
    failedStep: failedStep?.[0] ?? null,
    summary,
    responses: {
      userCreate,
      addressCreate,
      addressPut,
      addressPatch,
      addressDelete,
      addressList,
      userCleanup,
    },
  };
}
