import createPersistedState from 'use-persisted-state';
import {Language} from "../Language";
const useConfigurationsState = createPersistedState('configurations');
const CURRENT_VERSION = 0.2

type Configurations = {
  autoContinueNextWord: boolean,
  hardMode: boolean,
  hideWordNotes: boolean,
  language: Language,
  version: number
}

export const initialConfigurations = {
  autoContinueNextWord: false,
  hardMode: false,
  hideWordNotes: false,
  language: "ENG" as Language,
  version: 0.2
}

export const useConfigurations = (initialConfiguration: Configurations) => {
  let [configurations, setConfigurations] = useConfigurationsState(initialConfiguration);
  if (configurations.version !== CURRENT_VERSION) {
    configurations = Object.assign(initialConfigurations, configurations)
  }
  return {
    configurations,
    setConfigurations: (newConfigurations: Configurations) => setConfigurations(newConfigurations)
  }
}