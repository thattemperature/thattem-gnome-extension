import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';


export default class ThattemGnomeExtension extends Extension {

    enable() {
        const [, contents] = GLib.file_get_contents(
            GLib.build_filenamev([this.path, 'dbus-interface.xml'])
        );
        const ifaceXml = new TextDecoder().decode(contents);

        this._dbusImpl = Gio.DBusExportedObject.wrapJSObject(ifaceXml, this);
        this._dbusImpl.export(
            Gio.DBus.session,
            '/org/gnome/Shell/Extensions/ThattemGnomeExtension'
        );
    }

    disable() {
        this._dbusImpl?.unexport();
        this._dbusImpl = null;
    }

    // --- D-Bus methods ---

    SwitchWorkspaceTo(index) {
        const wm = global.workspace_manager;
        const ws = wm.get_workspace_by_index(index);
        ws.activate(global.get_current_time());
    }

    GetActiveWorkspace() {
        return global.workspace_manager.get_active_workspace_index();
    }

    GetWorkspaceCount() {
        return global.workspace_manager.get_n_workspaces();
    }
}
