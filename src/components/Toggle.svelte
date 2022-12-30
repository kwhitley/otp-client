<script>
  export let value
  export let label
</script>

<!-- MARKUP -->
<div>
  <label class="toggle">
    <input type="checkbox" bind:checked={value} />
    <span>{label}</span>
  </label>
</div>

<!-- STYLES -->
<style lang="scss">
  div {
    display: flex;
    justify-content: flex-start;
    align-self: flex-start;
  }

  .toggle {
    --active-color: var(--accent-color);
    --inactive-color: var(--foreground-25);
    --rail-height: 1.5rem;
    --rail-ratio: 1.8;
    --inset: 2px;
    flex: 1;
    margin-bottom: 0.3rem;
    color: var(--foreground-25);

    background-color: var(--foreground-5);
    padding: 0.4rem 0.5rem 0.4rem 0.7rem;
    border-radius: calc(0.5 * var(--border-radius));

    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    font-family: sans-serif;
    gap: 1em;
    user-select: none;
  }

  /* checkbox */
  .toggle input {
    order: 1;
    cursor: pointer;
    position: relative;
    font-size: 1.2rem;
    width: calc(var(--rail-height) * var(--rail-ratio));
    height: var(--rail-height);

    /* hide default styling */
    -webkit-appearance: none;
    appearance: none;
    background-color: var(--background-color);
    margin: 0;
    border-radius: 1em;
  }

  /* checkbox rail */
  .toggle input:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--inactive-color);
    border-radius: var(--rail-height);
    z-index: 0;
    transition: all 100ms ease;
  }

  /* checkbox rail (change color when checked) */
  .toggle input:checked:before {
    background-color: var(--active-color);
  }

  /* checkbox rail (flash on hover) */
  .toggle input:hover {
    opacity: 0.7;
  }

  /* checkbox handle (the white part) */
  .toggle input:after {
    content: '';
    background-color: var(--foreground-95);
    position: absolute;
    aspect-ratio: 1;
    top: var(--inset);
    bottom: var(--inset);
    left: var(--inset);
    border-radius: 100%;
    transition: left 200ms ease;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.3);
  }

  /* checkbox handle (slide when checked) */
  .toggle input:checked:after {
    left: calc(100% - var(--rail-height) + var(--inset));
  }

  /* change the color of the span text on check as well! */
  .toggle input:checked ~ * {
    color: var(--foreground-95);
  }

  /* just to center it all in the page */
  body {
    display: flex;
    justify-content: center;
    padding: 2em;
  }
</style>
