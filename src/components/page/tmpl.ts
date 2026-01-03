export const tmpl = `
<h1>{{{title}}}</h1>
<div class="{{#if hideForm}}hidden{{/if}}">
  {{{form}}}
</div>
<div class="{{#if hideFormPassword}}hidden{{/if}}">
  {{{formPassword}}}
</div>
<div class="{{#if hideEditButtons}}hidden{{/if}}">
  {{{editButton}}}
  {{{editPassword}}}
</div>
<div>
  {{{link}}}
</div>
`;
