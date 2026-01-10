export const tmpl = `
<div class="profile-input-container">
<div class="profile-input-container-inline">
  <label for="{{{name}}}" class="profile-input-container-title">{{{labelText}}}</label>
    {{#if profileEditUserInfo}}
        {{{input}}}
    {{else}}
        <span class="profile-input-container-text">{{{value}}}</span>
    {{/if}}
</div>
<div class="profile-input-container-border"></div>
  {{#if noValid}}
    <span class="profile-input-container-label-error">{{{errorText}}}</span>
  {{/if}}
</div>
`;
