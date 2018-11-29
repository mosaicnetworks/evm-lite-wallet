import store from './store/Store';
import AccountsActions from './actions/Accounts';
import ConfigActions from './actions/Configuration';
import AppActions from './actions/App';


export const accounts = new AccountsActions();
export const configuration = new ConfigActions();
export const app = new AppActions();

export {DataDirectoryParams} from './actions/App'
export {EVMLDispatch} from './common/Handlers';
export {DefaultProps, Store} from './store/Store'

export {BaseAccount} from 'evm-lite-lib'

export default store;