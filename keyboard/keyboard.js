const keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        keyboardColorPicker: null,
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        defaultColor: "#022a67",
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.keyboardColorPicker = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard-hidden");
        this.elements.main.id = "keyboard";
        this.elements.keysContainer.classList.add("keyboard_keys");
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keyboardColorPicker.appendChild(this._createColorPicker());

        // Store all keys elements to toggle the view based on capslock state
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard_key")

        // Add to DOM
        document.getElementById("colorpickerdiv").appendChild(this.elements.keyboardColorPicker);
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Open keyboard for elements with .use-keyboard
        document.querySelectorAll(".use-keyboard").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createColorPicker() {
        const fragment = document.createDocumentFragment();
        const label = document.createElement("label");
        label.textContent = "Pick color for keyboard: ";

        const colorInput = document.createElement("input");
        colorInput.id = "colorPicker";
        colorInput.setAttribute("type", "color");
        colorInput.value = this.properties.defaultColor;

        fragment.appendChild(label);
        fragment.appendChild(colorInput);

        // Synchronously change keyboard color based color picker change.
        colorInput.addEventListener("input", (color) => {
            document.getElementById("keyboard").style.background = colorInput.value;
        });
        return fragment;
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "done",
            "space"
        ];
        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`
        }

        // Loop through the keys
        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            // To add line break for each keyboard row
            const insertLineBreak = ["backspace", "p", "enter", "done"].indexOf(key) !== -1;

            // Add Classes/Attributes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard_key");

            // Add styles and event handlers for keys
            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard_key-wide");
                    keyElement.innerHTML = createIconHTML("backspace");
                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0,this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    })
                    break;

                case "caps":
                    keyElement.classList.add("keyboard_key-wide", "keyboard_key-activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard_key-active", this.properties.capsLock);
                    })
                    break;

                case "enter":
                    keyElement.classList.add("keyboard_key-wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");
                    keyElement.addEventListener('click', () => {
                        this.properties.value += "\n";
                        this._triggerEvent('oninput');
                    })
                    break;

                case "space":
                    keyElement.classList.add("keyboard_key-ultra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");
                    keyElement.addEventListener('click', () => {
                        this.properties.value += " ";
                        this._triggerEvent('oninput');
                    })
                    break;

                case "done":
                    keyElement.classList.add("keyboard_key-wide", "keyboard_key-dark");
                    keyElement.innerHTML = createIconHTML("check_circle");
                    keyElement.addEventListener('click', () => {
                        this.close();
                        this._triggerEvent('onclose');
                    })
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener('click', () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent('oninput');
                    })
                    break;
            }
            fragment.appendChild(keyElement);

            // To set the layout
            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;

    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !(this.properties.capsLock);
        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard-hidden")
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard-hidden")
    }
};

window.addEventListener("DOMContentLoaded", function () {
    keyboard.init();
    // keyboard.open("PSPK", function (currentValue) {
    //     console.log("Value changed to: " + currentValue);
    // }, function (currentValue) {
    //     console.log("keyboard closed! Finishing value: " + currentValue);
    // })
});