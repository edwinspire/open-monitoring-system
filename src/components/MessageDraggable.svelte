<script>
  import { onMount } from "svelte";
  let HeaderElement;
  let active = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;
  let MessageElement;
  export let Show = false;
  export let style = "";

  onMount(() => {
    //HeaderElement = document.querySelector("#item");
    console.log(    document.getElementsByClassName("HeaderElement"));
    HeaderElement = document.getElementsByClassName("HeaderElement")[0];
    MessageElement = document.getElementsByClassName("MessageElement")[0];
    //    console.log(this);
    //MessageElement = document.querySelector("#itemM");
    //container = document.querySelector("#container");
  });

  function dragStart(e) {
        console.log(e.target, HeaderElement);
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    if (e.target === HeaderElement) {
      active = true;
    }
    //active = true;
  }

  function dragEnd(e) {
    //    console.log(e);
    initialX = currentX;
    initialY = currentY;

    active = false;
  }

  function drag(e) {
    //console.log(e);
    if (active) {
      //e.preventDefault();

      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, HeaderElement);
    }
  }

  function setTranslate(xPos, yPos, el) {
    //    console.log(xPos, yPos, el);
    MessageElement.style.transform =
      "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }
</script>

<style>
  .message_box {
    min-width: 250px;
    border-color: #b5b5b5;
    border-left: solid;
    border-right: solid;
    border-bottom: solid;
    border-width: 1px;
    border-radius: 4px;
    position: absolute;
    z-index: 90;
    top: 20%;
    left: 20%;
  }

  .HeaderElement {
    cursor: move;
  }
  .TitleElement {
    cursor: default;
  }
</style>

<svelte:body
  on:touchstart={dragStart}
  on:touchend={dragEnd}
  on:touchmove|prevenDefault={drag}
  on:mousedown={dragStart}
  on:mouseup={dragEnd}
  on:mousemove|prevenDefault={drag} />

<article
  {style}
  class="message is-small MessageElement message_box "
  class:is-hidden={!Show}>
  <div class="message-header HeaderElement">
    <span class="TitleElement"><slot name="title" /></span> 
    <button
      class="delete"
      aria-label="delete"
      on:click={() => {
        Show = false;
      }} />
  </div>
  <div class="message-body">
    <slot name="body" />
  </div>
</article>
