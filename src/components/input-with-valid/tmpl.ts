export const tmpl = `
    <label for="{{{name}}}" class="input-container-title">{{{labelText}}}</label>
    {{{input}}}
    <div class="input-container-border"></div>
    {{#if noValid}}
        <span class="input-container-label-error">{{{errorText}}}</span>
    {{/if}}
`;
