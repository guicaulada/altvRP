import * as alt from "alt-server";
import * as proxy from "proxy";

alt.on("playerConnect", async (player) =>
  console.log(
    await proxy.client.serverGetFromClient(player, "ole", "dole", "dof"),
    await proxy.client.serverGetFromClient("uno", "dos", "tres")
  )
);

proxy.client.clientGetFromServer = (_, arg1, arg2) => {
  console.log(arg1, arg2);
  return "HELLO CLIENT, FROM SERVER";
};

proxy.server.serverGetFromServer = (arg1, arg2, arg3) => {
  console.log(arg1, arg2, arg3);
  return "HELLO SERVER, FROM SERVER";
};

console.log(proxy.server.serverGetFromServer("yo", "sister", "is"));
