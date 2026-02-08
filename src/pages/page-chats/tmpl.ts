export const tmpl = `
<div class="chat-header">
  <h1>{{title}}</h1>
  {{{link}}}
</div>
<div class="chat-page-container">
  <div class="chat-list-container">
    {{{addChatBtn}}}
    {{{chatList}}}
  </div>
  <div class="messages-section {{messagesSectionClass}}">
    <div class="chat-toolbar">
      <div class="chat-toolbar__header">
        <span class="chat-toolbar__title">{{currentChatTitle}}</span>
      </div>
      <div class="chat-toolbar__actions">
        {{{addUserBtn}}}
        {{{removeUserBtn}}}
      </div>
    </div>
    {{{messagesList}}}
    {{{form}}}
  </div>
</div>
`;
