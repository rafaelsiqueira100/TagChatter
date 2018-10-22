
(function (apiUrl) {
    //constantes que eu criei
    //tem que atualizar a lista de mensagens a cada 3 segundos
    const intervalMsgs = 3000;//3 segundos
    var I = null;
    var isUpdating = false;
    var isListing = false;
    
    function fetchParrotsCount() {
        
        console.log('fetchParrotsCount');
        return fetch(apiUrl + "/messages/parrots-count")
            .then(function(response) {
              return response.json();
            })
            .then(function (count) {
                if(initiating)
                    counter = count;
                else
                    counter = count;
                updateParrotsCount();

            });
    }
    function updateParrotsCount() {
        var spanParrotsCounter = document.getElementById("parrots-counter");
        if (spanParrotsCounter != null)
            spanParrotsCounter.innerHTML = counter;

    }
    function parrotMessage(event) {
        // Faz um request para marcar a mensagem como parrot no servidor
        // Altera a mensagem na lista para que ela apareça como parrot na interface
        
        if (isListing || isUpdating) {
            console.log('desisti de parrotar');
            var millisecondsToWait = 30;
            setTimeout(function() {
                parrotMessage(event);
            }, millisecondsToWait);
            return;
        }
        console.log("counter:"+counter);
        console.log('parrotMessage');
        var messageId = event.target.param;
        console.log(messageId);

        var img = document.getElementById(messageId + messageId);
        img.src = "images/parrot.gif";
        isUpdating = true;
        counter++;
        updateParrotsCount();
        img.removeEventListener('click', parrotMessage);
        img.addEventListener('click', unparrotMessage);
        img.param = messageId;
        var obj = {messageId : messageId};
        isUpdating = false;
        return fetch(apiUrl + "/messages/" + messageId + "/parrot",
            {
                method: 'PUT',
                body: JSON.stringify(obj),
                headers: { 'Content-Type': 'application/json' }
            }
        )
            .then(function (response) {
                isUpdating = false;
                return response.json();
            }).catch(err => isUpdating = false);
    }
    function unparrotMessage(event) {
        
        if (isListing || isUpdating) {
            console.log('desisti de desparrotar');
            var millisecondsToWait = 30;
            setTimeout(function() {
                unparrotMessage(event);
            }, millisecondsToWait);
            return;
        }
        console.log("counter:"+counter);
        console.log('unparrotMessage');

        var messageId = event.target.param;
        console.log(messageId);
        var img = document.getElementById(messageId + messageId);
        img.src = "images/light-parrot.svg";
        isUpdating = true;
        console.log(counter);
        counter--;
        console.log(counter);
        updateParrotsCount();
        img.removeEventListener('click', unparrotMessage);
        img.addEventListener('click', parrotMessage);
        img.param = messageId;
        var obj = {messageId : messageId};
        isUpdating = false;
        return fetch(apiUrl + "/messages/" + new String(messageId) + "/unparrot", {
            method: 'PUT',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/json' }
        }
        )
            .then(function (response) {
                isUpdating = false;
                return response.json();
            }).catch(err => isUpdating = false );
    }
      function listMessages() {
        // Faz um request para a API de listagem de mensagens
        // Atualiza a o conteúdo da lista de mensagens
        // Deve ser chamado a cada 3 segundos
          
          if (isUpdating) {
            
            var millisecondsToWait = 300;
            setTimeout(function() {
                listMessages();
            }, millisecondsToWait);
            return;//tenta novamente depois
          }
          isListing = true;
          fetchParrotsCount();
          return fetch(apiUrl + "/messages/")
              .then(function (response)
              {
                  isListing = false;
                  return response.json();
              })
              .then(function (messages)
              {
                    var tableMessages = document.getElementById("messages");
                    if (tableMessages != null) {
                        /* principais atributos:
                            avatar da pessoa
                            nome da pessoa
                            horário
                            parrot
                            conteúdo
                            */
                        var i = 0;
                        var qtasMensagens = messages.length;
                        var qtasLinhas = tableMessages.rows.length;
                        var j;
                        for (j = 0; j < qtasLinhas; j++) {
                            tableMessages.deleteRow(qtasLinhas-j-1);
                        }
                        for (; i < qtasMensagens; i++) {
                            
                            var row0 = tableMessages.insertRow(2 * i);
                            var row1 = tableMessages.insertRow(2 * i + 1);
                            var cellAvatar = row0.insertCell(0);
                            cellAvatar.innerHTML = '<img src=' + messages[i].author.avatar + '/>';
                            cellAvatar.rowSpan = 2;
                            var cellAuthor = row0.insertCell(1);
                            cellAuthor.innerHTML = messages[i].author.name;
                            var date = messages[i].created_at;
                            var formattedDate = new String(date).substring(11, 16);
                            var cellDate = row0.insertCell(2);
                            cellDate.innerHTML = formattedDate;
                            var cellParrot = row0.insertCell(3);
                            if (messages[i].hasParrot == true) {
                                //javascript: no onclick
                                cellParrot.innerHTML = '<img src="images/parrot.gif" id="' + messages[i].id + messages[i].id + '" />';
                                var handleImgParrot = document.getElementById(messages[i].id + messages[i].id);
                                handleImgParrot.addEventListener('click',  unparrotMessage);
                                handleImgParrot.param = messages[i].id;
                            }
                            else {
                                cellParrot.innerHTML = '<img src="images/light-parrot.svg" id="' + messages[i].id + messages[i].id + '" />';
                                var handleImgParrot = document.getElementById(messages[i].id + messages[i].id);
                                handleImgParrot.addEventListener('click', parrotMessage);
                                handleImgParrot.param = messages[i].id;
                            }
                            var cellContent = row1.insertCell(0);
                            cellContent.innerHTML = messages[i].content;
                            cellContent.colSpan = 3;
                              
                        }//fim do loop de mensagens

                        
                    }
                  
                    isListing = false;
              });
      }

      
    function send() {

        console.log('send');
        if (document.getElementById("text") != null) {
            var input = document.getElementById("text");
            var msg = input.value;

            sendMessage(msg, I.id);
        }
    }
  function sendMessage(message, authorId) {
    // Manda a mensagem para a API quando o usuário envia a mensagem
    // Caso o request falhe exibe uma mensagem para o usuário utilizando Window.alert ou outro componente visual
    // Se o request for bem sucedido, atualiza o conteúdo da lista de mensagens
     
      console.log('sendMessage');
      try{
      var body = { message: new String(message), author_id: authorId}
             
      return fetch(apiUrl + "/messages/",
          {
              method: 'POST',
              body: JSON.stringify(body),
              headers: { 'Content-Type': 'application/json' }
          })
          .then(function (response) {
              return response.json();
          })
          .then(function(){
            listMessages();
          });
      }
      catch(err){
          alert("Nao foi possivel enviar a mensagem. Tente novamente!");
      }
  }

  function getMe() {
    // Faz um request para pegar os dados do usuário atual
    // Exibe a foto do usuário atual na tela e armazena o seu ID para quando ele enviar uma mensagem
      // OBTÉM ID, NOME E AVATAR
      
      console.log('getMe');
      return fetch(apiUrl + "/me")
          .then(function (response) {
              return response.json();
          })
          .then(function (me) {
              //variável global i guarda os atributos do usuário que está recebendo mensagens
              
              I = me;
              console.log(I);
              console.log(I.id);
              console.log(I.name);
              console.log(I.avatar);
              var divAvatar =
                  document.getElementById("background__avatar");
              console.log("divAvatar == null? " + divAvatar == null);
              var handleImgSend =
              document.getElementById('img__send');
              if (handleImgSend!= null)
                  handleImgSend.addEventListener('click', send);
              else
                  console.log('handle é nulo');
              if (divAvatar != null)
                  
                divAvatar.innerHTML += "<img id='avatar'src=" +I.avatar + " /> ";
              
          });
  }

    function initialize() {
        initiating = true;
        console.log('initialize');
        getMe();
        listMessages();
        initiating = false;
        setInterval(listMessages, intervalMsgs);
        
  }

  initialize();
})("https://tagchatter.herokuapp.com");