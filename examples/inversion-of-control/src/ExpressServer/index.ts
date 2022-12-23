import { Application } from 'express';
import { ServerConfig } from '../interfaces/ServerConfig';

const ExpressServer = (app: Application, { port, defaultPath }: ServerConfig) => ({
  start() {
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
      console.log(`Follow: http://localhost:${port}${defaultPath}`);
    });

    return true;
  },
});

export default ExpressServer;
