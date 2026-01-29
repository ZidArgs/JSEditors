import {
    deepClone
} from "/emcJS/util/helper/DeepClone.js";
import DefaultFromConfigDataConverter from "/JSEditors/modules/form/util/DefaultFromConfigDataConverter.js";

export default class FromConfigDataConverter extends DefaultFromConfigDataConverter {

    translateSetConfig(config) {
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
        if (Array.isArray(elements)) {
            const res = [];
            for (const element of elements) {
                const resElement = this.#translateElement(element);
                res.push(this.injectFormElementId(resElement));
            }
            return res;
        } else {
            const res = [];
            for (const name in elements) {
                const element = {
                    name,
                    ...elements[name]
                };
                const resElement = this.#translateElement(element);
                res.push(this.injectFormElementId(resElement));
            }
            return res;
        }
    }

    #translateElement(element) {
        const {name, label = name, type, children, values, ...data} = element;
        const resElement = {
            name,
            label,
            type: this.#translateType(type),
            ...data
        };
        if (children != null) {
            resElement.children = this.translateSetConfigElementList(children);
        }
        if (values != null && typeof values === "object") {
            resElement.options = {};
            if (Array.isArray(values)) {
                for (const value of values) {
                    resElement.options[value] = value;
                }
            } else {
                for (const key in values) {
                    resElement.options[key] = values[key];
                }
            }
        }
        return resElement;
    }

    #translateType(type) {
        switch (type) {
            case "button": return "ActionButton";
            case "check": return "SwitchInputField";
            case "string": return "StringInputField";
            case "number": return "NumberInputField";
            case "range": return "RangeInputField";
            case "color": return "ColorInputField";
            case "password": return "PasswordInputField";
            case "hotkey": return "KeyBindInputField";
            case "choice": return "SearchSelectField";
            case "list": return "ListSelectField";
        }
        return type;
    }

}
