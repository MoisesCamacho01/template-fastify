import "tsconfig-paths/register";
import "dotenv/config";
import app from "./app/app";

const main = async () => {
  try {
    const puerto: number = parseInt(process.env.PORT ?? "3000");
    await app.listen({ port: puerto, host: "0.0.0.0" });
    console.log(`================== This server is listening on port ( ${puerto} ) ==================`);
  } catch (err: any) {
    console.log(`================== Error this port is not available ( ${err.message} ) ==================`);
  }
};

main();
