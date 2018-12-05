import store from './store/Store';
import Accounts from './actions/Accounts';
import KeystoreActions from './actions/Keystore';
import ConfigActions from './actions/Configuration';
import Application from './actions/App';


export const accounts = new Accounts();
export const configuration = new ConfigActions();
export const app = new Application();
export const keystore = new KeystoreActions();

export {DataDirectoryParams} from './actions/App'
export {EVMLDispatch} from './common/Handlers';
export {DefaultProps, Store} from './store/Store'

export {BaseAccount, ConfigSchema} from 'evm-lite-lib'

export default store;