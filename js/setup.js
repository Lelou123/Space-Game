function start(){//inicio funcao start
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1'class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    //---------principais variaveis do jogo
    var jogo = {};

    var TECLA = {
        W: 38,
        S: 40,
        D: 39
    };

    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);

    jogo.pressionou = [];
    var podeAtirar = true;
    var fimJogo = false;

    var salvos = 0;
    var perdidos = 0;
    var pontos = 0;

    var energiaAtual=3;

    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    musica.addEventListener("ended", function(){musica.currentTime=0; musica.play();}, false );
    musica.play();


    //------Pressiona TECLA
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });
    //--------------------------------------


    //------- Game loop ()

    jogo.timer = setInterval(loop, 30);

    function loop (){
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    }//-------fim funcao loop ()



    //---incio fundo loop ()
    function movefundo (){
        
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda-1);

    }//---fim funcao fundo ()



    //-------inicio funcao move jogador ()
    function movejogador (){
        if (jogo.pressionou[TECLA.W])
        {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo-10); //subatrai 10 levando o heli para cima

            if(topo <= 0)
            {
                $("#jogador").css("top", topo+10);
            }
        }
        if (jogo.pressionou[TECLA.S])
        {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo+10); //soma 10 levando o heli para baixo

            if(topo >= 434)
            {
                $("#jogador").css("top", topo-10);
            }
        }
        if (jogo.pressionou[TECLA.D])
        {
            //-----chama a funcao disparo
            disparo();
            
        }
    }
    //-----fim funcao move jogador()


    //-------Mover inimigo 1 ()
    function moveinimigo1(){
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - velocidade); // loop logo ira se aproximar do personagem principal;
        $("#inimigo1").css("top", posicaoY); // vai spawnar na posicao random pre definida;

        if(posicaoX <= 0)
        {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
    }//fim funcao moveinimigo1()

    //---------move inimigo2 ()

    function moveinimigo2(){
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX-3);

        if(posicaoX <= 0)
        {
            $("#inimigo2").css("left", 775);
        }
    }//fim funcao moveinimigo2 ()


    //move amigo ()
    function moveamigo(){
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX+1);

        if(posicaoX > 906)
        {
            $("#amigo").css("left", 0);
        }
    }//fim funcao moveinimigo2 ()


    //---- funcao disparo ()
    function disparo(){
        if(podeAtirar == true)
        {
            somDisparo.play();
            podeAtirar = false;
            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            tirox = posicaoX + 190; // onde quero que o tiro saia mais o tamanho do helicoptero;
            topoTiro = topo + 38; // define a altura do tiro

            $("#fundoGame").append("<div id='disparo'></div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tirox);

            var tempoDisparo = window.setInterval(executaDisparo,30); // seta intervalo para repeticao

        }//fecha pode atirar

        // funcao disparo
        function executaDisparo(){
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX+15);

            if(posicaoX > 900)
            {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }// ----fecha executaDisparo ()
    }//---------------fecha funcao disparo ()


    //funcao colisao 
    function colisao(){
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

        //jogador com o inimigo1
        if(colisao1.length > 0)
        {
            energiaAtual = energiaAtual - 1;
            inimigo1X = ($("#inimigo1").css("left"));
            inimigo1Y = ($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
            
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        //jogador com o inimigo2
        if(colisao2.length > 0)
        {
            energiaAtual = energiaAtual - 1;
            inimigo2X = ($("#inimigo2").css("left"));
            inimigo2Y = ($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);
            
            $("#inimigo2").remove();
            reposicionaInimigo2();
        }

        //Inimigo 1 disparo
        if(colisao3.length > 0)
        {
            pontos = pontos + 100; // disparo com inimigo 1 
            velocidade = velocidade + 0.3; // aumenta a dificuldade gradualmente
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
            
            $("#disparo").css("left", 950); // Reposiciona disparo para exclusao do mesmo

            posicaoY = parseInt(Math.random() * 334); // respawn inimigo.
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
        //fim funcao colisao

        //Inimigo 2 disparo
        if(colisao4.length > 0)
        {
            pontos = pontos + 50; // disparos com o inimigo 2 
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
            
            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left", 950); // Reposiciona disparo para exclusao do mesmo
            
            reposicionaInimigo2(); // Respawn inimigo2 
        }//fim funcao colisao4

        //Reposiciona amigo
        if(colisao5.length > 0)
        {
            salvos++;
            somResgate.play();
            reposicionaAmigo();
            $("#amigo").remove();
        }

        //Inimigo 2 com o amigo 
        if(colisao6.length > 0)
        {
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            
            explosao3(amigoX,amigoY);
            $("#amigo").remove(); // remove amigo
            
            reposicionaAmigo(); // Respawn amigo 
        }//fim funcao colisao4

    }//fim funcao colisao



    //--------Explosão 1
    function explosao1(inimigo1X,inimigo1Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");

        var div=$("#explosao1");

        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");
	
	    var tempoExplosao=window.setInterval(removeExplosao, 1000);
	
		function removeExplosao() {
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao=null;
		}
		
	} // Fim funcao explosao1 ()


    //-------Explosão 2
    function explosao2(inimigo2X,inimigo2Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");

        var div2=$("#explosao2");

        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
	
	    var tempoExplosao=window.setInterval(removeExplosao, 1000);
	
		function removeExplosao() {
			div2.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao=null;
		}
		
	} // Fim funcao explosao2 ()


    //-------Explosão 3
    function explosao3(amigoX,amigoY) {
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3'class='anima4'></div");

        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left",amigoX);
        	
	    var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
	
		function resetaExplosao3() {
			$("#explosao3").remove();
			window.clearInterval(tempoExplosao3);
			tempoExplosao3=null;
		}
		
	} // Fim funcao explosao3 ()



    //--- reposiciona inimigos 2
    function reposicionaInimigo2(){
        var tempoColisao4 = window.setInterval(reposiciona4, 5000); // Apos 5s o ininimigo sera reposicionado

        function reposiciona4(){
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimJogo == false)
            {
                $("#fundoGame").append("<div id='inimigo2'></div>");
            }
        }
    }// fim funcao reposiciona inimigo2 ()


    // reposiciona amigo
    function reposicionaAmigo(){
        var tempoAmigo = window.setInterval(reposiciona6, 6000); // Apos 5s o ininimigo sera reposicionado

        function reposiciona6(){
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimJogo == false)
            {
                $("#fundoGame").append("<div id='amigo' anima3></div>");
            }
        }
    }// fim funcao reposiciona amigo()


    function placar(){
        
       $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    
    }// fim funcao placar

    // Funcao energia
    function energia(){
        if (energiaAtual == 3)
        {
            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }
        if (energiaAtual == 2)
        {
            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }
        if (energiaAtual == 1)
        {
            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }
        if (energiaAtual == 0)
        {
            $("#energia").css("background-image", "url(imgs/energia0.png)");

            gameOver();
        }
    }// fim funcao energia


    function gameOver(){
        fimJogo = true;
        musica.pause();
        somGameover.play();
        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        $("#fundoGame").append("<div id='fim'></div>");

        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
	 
        
    }// Fim da função gameOver();

}//fim funcao start



    // funcao reiniciar o jogo
    function reiniciaJogo(){
        
        somGameover.pause();
        $("#fim").remove();
        start();

    } // fim funcao reiniciaJogo()