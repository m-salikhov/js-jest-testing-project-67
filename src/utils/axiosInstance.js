import axios from 'axios';
import * as AxiosLogger from 'axios-logger';

AxiosLogger.setGlobalConfig({ data: false });

const instance = axios.create();
instance.interceptors.request.use(AxiosLogger.requestLogger);
instance.interceptors.response.use(AxiosLogger.responseLogger);

export default instance;
