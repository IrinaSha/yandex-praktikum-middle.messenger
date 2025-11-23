export const tmpl = `
<ul>
{{#each items}}
<li>
<a href = "{{this.url}}">{{this.title}}</a>
</li>
{{/each}}
</ul>
`;