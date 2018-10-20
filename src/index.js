(function (apiUrl) {
    //constantes que eu criei
    //tem que atualizar a lista de mensagens a cada 3 segundos
    const intervalMsgs = 3000;//3 segundos
   
  function fetchParrotsCount() {
    return fetch(apiUrl + "/messages/parrots-count")
      .then(function(response) {
        return response.json();
      })
      .then(function(count) {
          document.getElementById("parrots-counter").innerHTML = count;

      });
  }

  function listMessages() {
    // Faz um request para a API de listagem de mensagens
    // Atualiza a o conteúdo da lista de mensagens
    // Deve ser chamado a cada 3 segundos
      return fetch(apiUrl + "/messages/")
          .then(function (response) {
              return response.json();
          })
          .then(function (messages) {
              document.getElementById("table__avatars").innerHTML = "";
              document.getElementById("table__messages").innerHTML = "";
              for (int i = 0; i < messages.length; i++){
                //principais atributos:
                /*
                avatar da pessoa
                nome da pessoa
                horário
                parrot
                conteúdo
                */
                document.getElementById("table__avatars").innerHTML += "<tr><td>" + messages[i].avatar + "<tr><td>";
                var table__messages = document.getElementById("table__messages");
                table__messages.innerHTML += "<tr>";
                table__messages.innerHTML += "<td>" + messages[i].author.name+"</td>";
                table__messages.innerHTML += "<td>" + messages[i].createdAt + "</td>";
                if (messages[i].hasParrot) {
                    table__messages.innerHTML += "<td><img src='images/parrot.gif' /></td>";
                }
                else {
                    table__messages.innerHTML += "<td></td>";
                }
                table__messages.innerHTML += "</tr>";
                table__messages.innerHTML += "<tr>";
                table__messages.innerHTML += "<td>"+messages[i].content+"</td>"
                table__messages.innerHTML += "</tr>";
              }
              
          });
  }

  function parrotMessage(messageId) {
    // Faz um request para marcar a mensagem como parrot no servidor
    // Altera a mensagem na lista para que ela apareça como parrot na interface

    }
    function send() {
        var msg = document.getElementById("text").value;
        sendMessage(msg, i.id);

    }
  function sendMessage(message, authorId) {
    // Manda a mensagem para a API quando o usuário envia a mensagem
    // Caso o request falhe exibe uma mensagem para o usuário utilizando Window.alert ou outro componente visual
    // Se o request for bem sucedido, atualiza o conteúdo da lista de mensagens
      var date_now = new Date();
      var now = date.toISOString();
      
      var body = { id: authorId, content: new String(message), created_at: new String(now), has_parrot: false, author: i }
      return fetch(apiUrl + "/messages/parrots-count",
          {
              method: 'POST',
              body: JSON.stringify(body),
              headers: { 'Content-Type': 'application/json' }
          })
          .then(function (response) {
              return response.json();
          })
        .catch(err => );
  }

  function getMe() {
    // Faz um request para pegar os dados do usuário atual
    // Exibe a foto do usuário atual na tela e armazena o seu ID para quando ele enviar uma mensagem
      // OBTÉM ID, NOME E AVATAR
      return fetch(apiUrl + "/me")
          .then(function (response) {
              return response.json();
          })
          .then(function (me) {
              //variável global i guarda os atributos do usuário que está recebendo mensagens
              i = me;
              document.getElementById("background__avatar").innerHTML = "<img id='avatar' src=" + i.avatar + " /> ";
              
          });
  }

  function initialize() {
      fetchParrotsCount();

      getMe();
      var handleImgSend = 
          document.getElementById("img__send")
      handleImgSend.onclick = send()
      window.setInterval(listMessages(), intervalMsgs);

  }

  initialize();
})("https://tagchatter.herokuapp.com");