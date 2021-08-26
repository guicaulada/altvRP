import * as proxy from "proxy";

proxy.server.serverGetFromClient = (arg1, arg2, arg3) => {
  console.log(arg1);
  console.log(arg2);
  console.log(arg3);
  return "HELLO SERVER, FROM CLIENT";
};

proxy.server.clientGetFromServer("lucid", "mexican").then(console.log);

proxy.client.clientGetFromClient = (arg1, arg2, arg3) => {
  console.log(arg1, arg2, arg3);
  return "HELLO CLIENT, FROM CLIENT";
};

console.log(proxy.client.clientGetFromClient("yo", "mama", "is"));
