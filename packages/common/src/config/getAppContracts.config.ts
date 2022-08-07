/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createConnectorForExternalContract, createConnectorForHardhatContract } from 'eth-hooks/context';
import { invariant } from 'ts-invariant';

import { externalContractsAddressMap } from './externalContracts.config';

import * as hardhatContracts from '~common/generated/contract-types';
import * as externalContracts from '~common/generated/external-contracts/esm/types';
import hardhatDeployedContractsJson from '~common/generated/hardhat_contracts.json';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * ### Instructions
 * 1. edit externalContracts.config.ts to add your external contract addresses.
 * 2. edit `getAppContractsConfig` function below and add them to the list
 * 3. run `yarn contracts:build` to generate types for contracts
 * 4. run `yarn deploy` to generate hardhat_contracts.json
 *
 * ### Summary
 * - called  by useAppContracts
 * @returns
 */
export const getAppContractsConfig = () => {
  try {
    const result = {
      // --------------------------------------------------
      // 🙋🏽‍♂️ Add your hadrdhat contracts here
      // --------------------------------------------------
      Staking: createConnectorForHardhatContract(
        'Staking',
        hardhatContracts.Staking__factory,
        hardhatDeployedContractsJson
      ),
      RewardToken: createConnectorForHardhatContract(
        'RewardToken',
        hardhatContracts.RewardToken__factory,
        hardhatDeployedContractsJson
      ),

      // --------------------------------------------------
      // 🙋🏽‍♂️ Add your external contracts here, make sure to define the address in `externalContractsConfig.ts`Í
      // --------------------------------------------------
      DAI: createConnectorForExternalContract('DAI', externalContracts.DAI__factory, externalContractsAddressMap),

      // --------------------------------------------------
      // 🙋🏽‍♂️ Add your external abi here (unverified contracts)`
      // --------------------------------------------------
      // WBTC: createConnectorForExternalAbi(
      //   'WBTC',
      //   {
      //     [31337]: {
      //       address: 'xxx',
      //       chainId: 31337,
      //     },
      //   },
      //   hardhatContracts.MockERC20__factory.abi,
      //   hardhatContracts.MockERC20__factory.connect
      // ),
    } as const;

    return result;
  } catch (e) {
    invariant.error(
      '❌ getAppContractsConfig: ERROR with loading contracts please run `yarn contracts:build or yarn contracts:rebuild`.  Then run `yarn deploy`!'
    );
    invariant.error(e);
  }

  return undefined;
};
