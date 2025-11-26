export const tmpl = `
    <label for="{{{name}}}" class="input-container-title">{{{labelText}}}</label>
    <input id="{{{name}}}" name="{{{name}}}" type="{{{inputType}}}" class="input-container-value">
    <div class="input-container-border"></div>
    {{#if noValid}}
        <span class="input-container-label-error">{{{errorText}}}</span>
    {{/if}}
`;