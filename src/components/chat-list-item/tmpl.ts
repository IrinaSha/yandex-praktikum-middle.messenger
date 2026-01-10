export const tmpl = `
   <div class="chat-item-container {{#if selected}}active{{/if}}">
     <div class="chat-item-avatar">{{{avatar}}}</div>
     <div class="chat-item-text-container">
       <span class="chat-item-title">{{{title}}}</span>
       <span class="chat-item-text">{{{text}}}</span>
     </div>
     <div class="chat-item-info">
       <span class="chat-item-info-date">{{{date}}}</span>
       <span class="chat-item-info-new-num">{{{newNum}}}</span>
     </div>
   </div>
`;
