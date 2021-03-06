import { Box, Card, Hidden, Snackbar, Typography } from '@material-ui/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { DynamicModuleLoader } from 'redux-dynamic-modules';

import Highlight from '../shared/highlight';
import HeroEdit from './hero-edit';
import HeroList from './hero-list';
import { HeroAwareState, HeroModule } from './hero.module';
import { ViewMode } from './models';
import * as actions from './store/hero.actions';

const mapStateToProps = ({ hero }: HeroAwareState) => {
  return {
    heroes: hero?.heroes,
    powers: hero?.powers,
    selectedHero: hero?.selectedHero,
    snackbarMessage: hero?.snackbarMessage,
    snackbarOpen: hero?.snackbarOpen,
    viewMode: hero?.viewMode,
  };
};

const mapDispatchToProps = {
  addHero: actions.addHero,
  hideSnackbar: actions.hideSnackbar,
  removeHero: actions.removeHero,
  setViewMode: actions.setViewMode,
  selectHero: actions.selectHero,
  updateHero: actions.updateHero,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

const Hero: React.FunctionComponent<Props> = (props) => {
  const {
    heroes,
    powers,
    selectedHero,
    snackbarMessage,
    snackbarOpen,
    viewMode,
    addHero,
    hideSnackbar,
    removeHero,
    selectHero,
    setViewMode,
    updateHero,
  } = props;

  const onSnackbarClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason !== 'clickaway') {
      hideSnackbar();
    }
  };

  return (
    <DynamicModuleLoader modules={[HeroModule]}>
      <Hidden smDown={true}>
        <Typography className="mb-24" variant="h4">
          Heroes Application
        </Typography>
      </Hidden>
      <Box display="flex">
        <Box flex="1 1 100%" flexGrow={1} clone={true}>
          <Card className="px-16">
            {(viewMode === ViewMode.Add && (
              <HeroEdit
                onCancelClick={() => setViewMode(ViewMode.List)}
                onSaveClick={addHero}
                powers={powers}
              />))
            || (viewMode === ViewMode.Edit && (
              <HeroEdit
                hero={selectedHero}
                onCancelClick={() => setViewMode(ViewMode.List)}
                onSaveClick={updateHero}
                powers={powers}
              />))
            || (viewMode === ViewMode.List && (
              <HeroList
                heroes={heroes}
                selectedHero={selectedHero}
                onAddClick={() => setViewMode(ViewMode.Add)}
                onEditClick={() => setViewMode(ViewMode.Edit)}
                onRemoveClick={removeHero}
                onSelectClick={selectHero}
              />
            ))}
          </Card>
        </Box>
        <Hidden smDown={true}>
          <Box className="section" flex="1 1 100%" flexGrow={1} ml={'5%'}>
            <Typography variant="h5">
              A Simple Example...
            </Typography>
            <p>
              This is a classic <Highlight>heroes</Highlight> CRUD example where you can add, edit or remove your favorite heroes.
            </p>
            <p>
              State management is implemented using the beloved <Highlight>react-redux</Highlight>, the official React bindings for
              <Highlight>redux</Highlight> library, combined with <Highlight>redux-saga</Highlight> middleware that adds side effect
              capabilities on dispatched actions to execute asynchronous operations and interact with the store.
            </p>
            <p>
              The form implementation is made with <Highlight>formik</Highlight> and <Highlight>formik-material-ui</Highlight> bindings
              adapted for <Highlight>material-ui</Highlight> design library.
            </p>
            <p>
              Backend server is mocked using <Highlight>redux-persist</Highlight> addon to persist state changes in LocalStorage
              in combinaison with <Highlight>miragejs</Highlight> library to initially load stored data and mock HTTP
              requests.
            </p>
            <p>
              Transitions are made with <Highlight>react-spring</Highlight> library that makes it easy to write powerfull and interactive
              animation sequences in a jiffy.
            </p>
          </Box>
        </Hidden>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={4000}
        message={snackbarMessage}
        onClose={onSnackbarClose}
        open={snackbarOpen}
      />
    </DynamicModuleLoader>
  );
};

export default connector(Hero);
