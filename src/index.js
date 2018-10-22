
(function (apiUrl) {
    //constantes que eu criei
    //tem que atualizar a lista de mensagens a cada 3 segundos
    const intervalMsgs = 30000;//3 segundos
    var I = null;
    var isUpdating = false;
    var isListing = false;
    /*const fetch = require('node-fetch');
    //fetch: para fazer requisições rest HTML
    const debug = require('debug')('app');
    //debug: debugar a aplicação
    //se pode executar a aplicação com modo de debug
    //a partir do cmd do Windows com o seguinte comando:
    //set DEBUG=* & node index.js
    const setInterval = require('set-interval');
    //set-interval: para chamar listMessages() a cada 3 segundos
    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    //jsdom: para manipular a página HTML
    const { window } = new JSDOM(``, {
        url: "file:///C:/Users/rafae/Downloads/tagchatter-master/src/index.html",
        referrer: "file:///C:/Users/rafae/Downloads/tagchatter-master/src/index.html",
        contentType: "text/html",
        includeNodeLocations: true,
        storageQuota: 10000000,
        runScripts: "outside-only",//permite rodar scripts externos
        resources: "usable"//pode  usar recursos externos, como imagens
    }).window;
    global.document = window.document;
    //importar canvas para mexer com imagens 
    /*
     window.eval(`document.body.innerHTML = "<p>Hello, world!</p>";`);
     window.document.body.children.length === 1;
     */
    function fetchParrotsCount() {
        //debug('fetchParrotsCount');
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
        //debug('parrotMessage');
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
        //debug("unparrotMessage");
        
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
          //debug('listMessages');
          //console.log('listMessages');
          if (isUpdating) {
            console.log('desisti de listar mensagens');
            var millisecondsToWait = 300;
            setTimeout(function() {
                listMessages();
            }, millisecondsToWait);
            return;
          }
          console.log('listando mensagens')
          isListing = true;
          fetchParrotsCount();
          
          return fetch(apiUrl + "/messages/")
              .then(function (response)
              {
                  //debug('respondendo');
                  //console.log('respondendo');
                  isListing = false;
                  return response.json();
              })
              .then(function (messages)
              {
                    /*console.log(messages);
                    console.log(messages.length);
                    */
                    //debug('tratando mensagens')
                    //console.log('tratando mensagens');
                    var tableMessages = document.getElementById("messages");
                    //debug('tableAvatars');
                    //console.log('tableMessages');
                  
                    //tableMessages = document.getElementById("messages");
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
                            //debug(i);
                            /*console.log(i);
                            console.log(messages[i]);
                            console.log(messages[i].author.avatar);
                            /*console.log(messages[i].createdAt);
                            console.log(messages[i].id);
                            console.log(messages[i].content);
                            console.log(messages[i].author);
                            console.log(messages[i].author.name);*/
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
                            //moment().format('MMMM Do YYYY, h:mm:ss a');
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

        //debug("send");
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
      //debug("sendMessage");
      console.log('sendMessage');

      var body = { message: new String(message), author_id: authorId}
      //adicionar na lista
      //avatar autor + nome autor + horário + parrotCount + content
      /*var tableMessages = document.getElementById("messages");
      var qtasLinhas = tableMessages.rows.length;
      var row0 = tableMessages.insertRow(qtasLinhas);
        var row1 = tableMessages.insertRow(qtasLinhas + 1);
        var cellAvatar = row0.insertCell(0);
        cellAvatar.innerHTML = '<img src=' + I.avatar + '/>';
        cellAvatar.rowSpan = 2;
        var cellAuthor = row0.insertCell(1);
        cellAuthor.innerHTML = I.name;
        var date = (new Date()).toISOString();
        var formattedDate = new String(date).substring(11, 16);
        var cellDate = row0.insertCell(2);
        cellDate.innerHTML = formattedDate;
        //moment().format('MMMM Do YYYY, h:mm:ss a');
        var cellParrot = row0.insertCell(3);
        
            cellParrot.innerHTML = '<img src="images/light-parrot.svg" id="' + messages[i].id + messages[i].id + '" />';
              var handleImgParrot = document.getElementById(messages[i].id + messages[i].id);
            handleImgParrot.addEventListener('click', parrotMessage);
            handleImgParrot.param = messages[i].id;
        
        var cellContent = row1.insertCell(0);
        cellContent.innerHTML = messages[i].content;
        cellContent.colSpan = 3;          */                  
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
          })
          .catch(err => alert("Nao foi possivel enviar a mensagem. Tente novamente!"));
  }

  function getMe() {
    // Faz um request para pegar os dados do usuário atual
    // Exibe a foto do usuário atual na tela e armazena o seu ID para quando ele enviar uma mensagem
      // OBTÉM ID, NOME E AVATAR
      //debug("getMe");
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