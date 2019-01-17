import * as React from 'react';
import * as ReactDom from 'react-dom';
import BuildInPluginState from './BuildInPluginState';
import Editor from './editor/Editor';
import MainPaneBase from './MainPaneBase';
import Ribbon from './ribbon/Ribbon';
import SidePane from './sidePane/SidePane';
import TitleBar from './titleBar/TitleBar';
import { getAllPluginArray, getPlugins, getSidePanePluginArray } from './plugins';

const styles = require('./MainPane.scss');
const classnames = require('classnames/bind').bind(styles);

class MainPane extends MainPaneBase {
    private mouseX: number;
    private editor = React.createRef<Editor>();

    render() {
        let plugins = getPlugins();

        return (
            <div className={classnames(styles.mainPane, { darkMode: true })}>
                <TitleBar className={styles.noGrow} />
                <Ribbon
                    plugin={plugins.ribbon}
                    className={styles.noGrow}
                    ref={plugins.ribbon.refCallback}
                />
                <div className={styles.body}>
                    <Editor
                        plugins={getAllPluginArray()}
                        className={classnames(styles.editor, { darkMode: true })}
                        ref={this.editor}
                        initState={plugins.editorOptions.getBuildInPluginState()}
                        undo={plugins.snapshot}
                        isDarkMode={true}
                    />
                    <div className={styles.resizer} onMouseDown={this.onMouseDown} />
                    <SidePane
                        ref={ref => (this.sidePane = ref)}
                        plugins={getSidePanePluginArray()}
                        className={styles.sidePane}
                    />
                </div>
            </div>
        );
    }

    resetEditorPlugin(pluginState: BuildInPluginState) {
        this.editor.current.resetEditorPlugin(pluginState);
    }

    updateForamtState() {
        getPlugins().formatState.updateForamtState();
    }

    private onMouseDown = (e: React.MouseEvent<EventTarget>) => {
        document.addEventListener('mousemove', this.onMouseMove, true);
        document.addEventListener('mouseup', this.onMouseUp, true);
        document.body.style.userSelect = 'none';
        this.mouseX = e.pageX;
    };

    private onMouseMove = (e: MouseEvent) => {
        this.sidePane.changeWidth(this.mouseX - e.pageX);
        this.mouseX = e.pageX;
    };

    private onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', this.onMouseMove, true);
        document.removeEventListener('mouseup', this.onMouseUp, true);
        document.body.style.userSelect = '';
    };
}

export function mount(parent: HTMLElement) {
    ReactDom.render(<MainPane />, parent);
}
