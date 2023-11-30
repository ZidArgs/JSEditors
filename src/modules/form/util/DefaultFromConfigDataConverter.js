import {
    appUID
} from "/emcJS/util/helper/UniqueGenerator.js";
import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";

export default class DefaultFromConfigDataConverter {

    translateSetConfig(config) {
        if (config == null) {
            return {};
        }
        config = deepClone(config);
        const res = {
            forms: [],
            hasHeader: false,
            hasFooter: false,
            defaultValues: {}
        };
        if (config.forms == null) {
            res.forms.push(this.injectFormId({
                elements: this.translateSetConfigElementList(config),
                config: {}
            }));
        } else {
            for (const form of config.forms) {
                res.forms.push(this.injectFormId({
                    elements: this.translateSetConfigElementList(form.elements),
                    config: form.config ?? {}
                }));
            }
        }
        return res;
    }

    translateSetConfigElementList(elements) {
        const res = [];
        for (const element of elements) {
            const {children, ...data} = element;
            const resElement = {...data};
            if (children != null) {
                resElement.children = this.translateSetConfigElementList(children)
            }
            res.push(this.injectFormElementId(resElement));
        }
        return res;
    }

    translateGetConfig(config) {
        config = deepClone(config);
        const res = {
            forms: [],
            hasHeader: false,
            hasFooter: false,
            defaultValues: {}
        };
        for (const form of config.forms) {
            res.forms.push(this.removeFormId({
                elements: this.translateGetConfigElements(form.elements),
                config: form.config ?? {}
            }));
        }
        return res;
    }

    translateGetConfigElements(elements) {
        const res = [];
        for (const element of elements) {
            const {children, ...data} = element;
            const resElement = {...data};
            if (children != null) {
                resElement.children = this.translateGetConfigElements(children)
            }
            res.push(this.removeFormElementId(resElement));
        }
        return res;
    }

    extractTreeStructure(config) {
        const tree = {};
        let cnt = 1;
        for (const form of config.forms) {
            tree[form.config.data.id] = {
                label: `Form ${cnt++}`,
                children: this.extractTreeStructureElement(form.elements)
            };
        }
        return tree;
    }

    extractTreeStructureElement(elements) {
        const result = {};
        for (const element of elements) {
            const {children, ...params} = element;
            const label = this.extractTreeStructureLabel(params);
            if (children != null) {
                result[element.data.id] = {
                    label,
                    children: this.extractTreeStructureElement(children)
                };
            } else {
                result[element.data.id] = {
                    label
                };
            }
        }
        return result;
    }

    extractTreeStructureLabel(params) {
        const {type, text, label = text, name, id} = params;
        let res = type ? `(${type})` : "(-- new --)";
        if (label) {
            res = `${label} ${res}`;
        }
        if (name) {
            res += ` $${name}`;
        }
        if (id) {
            res += ` #${id}`;
        }
        return res;
    }

    injectFormId(form) {
        if (form.config == null) {
            form.config = {data: {}};
        } else if (form.config.data == null) {
            form.config.data = {};
        }
        form.config.data["id"] = appUID("form");
        return form;
    }

    removeFormId(form) {
        delete form.config.data.id;
        return form;
    }

    injectFormElementId(element) {
        if (element.data == null) {
            element.data = {};
        }
        element.data["id"] = appUID("form-element");
        return element;
    }

    removeFormElementId(element) {
        delete element.data.id;
        return element;
    }

}
