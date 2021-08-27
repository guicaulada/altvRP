import * as proxy from "../modules/proxy";

try {
  proxy.server.notAllowed = () => {
    return "NOT ALLOWED TO CLIENT SERVER FUNCTIONS ON CLIENT";
  };
} catch {
  console.log("Proxy error check succeeded!");
}

proxy.server.getHello("hey", "server").then(console.log);

proxy.client.getHello = (arg1: string, arg2: string, arg3: string) => {
  console.log(arg1, arg2, arg3);
  if (arg1 == "call") {
    return "HELLO CLIENT, FROM CLIENT";
  }
  return "HELLO SERVER, FROM CLIENT";
};

console.log(proxy.client.getHello("call", "function", "directly"));
