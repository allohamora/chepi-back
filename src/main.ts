import { Server } from './server';

const main = async () => {
  const server = await Server.forProduction();

  await server.listen();
};

main();
