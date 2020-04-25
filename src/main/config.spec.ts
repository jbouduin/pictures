import { Configuration } from './configuration/configuration';

class Main {
  /* tslint:disable no-bitwise */
  public execute() {
    Configuration
      .loadConfiguration()
      .then( configuration => {
        console.log(configuration);
      });
  }
}

new Main().execute();
