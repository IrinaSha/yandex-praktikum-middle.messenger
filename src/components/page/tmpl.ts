export const tmpl = `
<h1>{{{title}}}</h1>
{{{form}}}
<div class="{{#if hideEditButtons}}hidden{{/if}}">
  {{{editButton}}}
  {{{editPassword}}}
  {{{link}}}
</div>
`;
