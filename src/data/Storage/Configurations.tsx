import createPersistedState from 'use-persisted-state';
const useConfigurationsState = createPersistedState('configurations');

type Configurations = {
  autoContinueNextWord: boolean,
  hideWordNotes: boolean,
  version: number
}

export const initialConfigurations = {
  autoContinueNextWord: false,
  hideWordNotes: false,
  version: 0.1
}

export const useConfigurations = (initialConfiguration: Configurations) => {
  const [configurations, setConfigurations] = useConfigurationsState(initialConfiguration);
  return {
    configurations,
    setConfigurations: (newConfigurations: Configurations) => setConfigurations(newConfigurations)
  }
}