import members from "../../members.ts";
import { Rhum } from "../../deps.ts";
import { Drash } from "../../../mod.ts";
import CookieResource from "./resources/cookie_resource.ts";
import { runServer } from "../test_utils.ts";

const server = new Drash.Http.Server({
  resources: [
    CookieResource,
  ],
});

Rhum.testPlan("cookie_resource_test.ts", () => {
  Rhum.testSuite("/cookie", () => {
    Rhum.testCase("cookie can be created, retrieved, and deleted", async () => {
      await runServer(server);

      let response;
      let cookies;
      let cookieName;
      let cookieVal;

      const cookie = { name: "testCookie", value: "Drash" };

      // Post
      response = await members.fetch.post("http://localhost:3000/cookie", {
        headers: {
          "Content-Type": "application/json",
        },
        body: cookie,
      });
      Rhum.asserts.assertEquals(await response.text(), '"Saved your cookie!"');

      // Get - Dependent on the above post request saving a cookie
      response = await members.fetch.get("http://localhost:3000/cookie", {
        credentials: "same-origin",
        headers: {
          Cookie: "testCookie=Drash",
        },
      });
      await Rhum.asserts.assertEquals(await response.text(), '"Drash"');

      // Remove - Dependent on the above post request saving a cookie
      response = await members.fetch.delete("http://localhost:3000/cookie", {
        headers: {},
      });
      cookies = response.headers.get("set-cookie") || "";
      cookieVal = cookies.split(";")[0].split("=")[1];
      Rhum.asserts.assertEquals(cookieVal, "");
      await response.arrayBuffer();
      //await response.body.close()

      await server.close();
    });
  });
});

Rhum.run();
