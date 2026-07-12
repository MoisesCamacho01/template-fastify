import crypto from "node:crypto";

const KEY_ID = process.env.OIDC_KEY_ID ?? "login-api-rs256";

type RsaJwk = {
	kty: "RSA";
	kid: string;
	use: "sig";
	alg: "RS256";
	n: string;
	e: string;
};

let cachedPrivateKey: crypto.KeyObject | null = null;
let cachedPublicKey: crypto.KeyObject | null = null;

export const signJwtRs256 = (payload: object): string => {
	const header = {
		alg: "RS256",
		typ: "JWT",
		kid: KEY_ID,
	};
	const unsignedToken = `${base64Url(header)}.${base64Url(payload)}`;
	const signature = crypto.sign("RSA-SHA256", Buffer.from(unsignedToken), getPrivateKey()).toString("base64url");

	return `${unsignedToken}.${signature}`;
};

export const getPublicJwk = (): RsaJwk => {
	const jwk = getPublicKey().export({ format: "jwk" });

	if (jwk.kty !== "RSA" || typeof jwk.n !== "string" || typeof jwk.e !== "string") {
		throw new Error("OIDC public key must be an RSA key");
	}

	return {
		kty: "RSA",
		kid: KEY_ID,
		use: "sig",
		alg: "RS256",
		n: jwk.n,
		e: jwk.e,
	};
};

const getPrivateKey = (): crypto.KeyObject => {
	if (cachedPrivateKey !== null) {
		return cachedPrivateKey;
	}

	const privateKeyPem = normalizePem(process.env.OIDC_PRIVATE_KEY);

	if (privateKeyPem !== undefined) {
		cachedPrivateKey = crypto.createPrivateKey(privateKeyPem);
		cachedPublicKey = crypto.createPublicKey(cachedPrivateKey);
		return cachedPrivateKey;
	}

	const generated = crypto.generateKeyPairSync("rsa", {
		modulusLength: 2048,
		publicKeyEncoding: { format: "pem", type: "spki" },
		privateKeyEncoding: { format: "pem", type: "pkcs8" },
	});

	cachedPrivateKey = crypto.createPrivateKey(generated.privateKey);
	cachedPublicKey = crypto.createPublicKey(generated.publicKey);

	return cachedPrivateKey;
};

const getPublicKey = (): crypto.KeyObject => {
	if (cachedPublicKey !== null) {
		return cachedPublicKey;
	}

	const publicKeyPem = normalizePem(process.env.OIDC_PUBLIC_KEY);

	if (publicKeyPem !== undefined) {
		cachedPublicKey = crypto.createPublicKey(publicKeyPem);
		return cachedPublicKey;
	}

	cachedPublicKey = crypto.createPublicKey(getPrivateKey());
	return cachedPublicKey;
};

const normalizePem = (value: string | undefined): string | undefined => {
	if (value === undefined || value.trim() === "") {
		return undefined;
	}

	return value.replaceAll("\\n", "\n");
};

const base64Url = (value: object): string => {
	return Buffer.from(JSON.stringify(value)).toString("base64url");
};
