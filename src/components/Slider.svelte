<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips'

  export let label
  export let afterLabel
  export let options
  export let format = v => v
  export let value

  let values = []
  const getValue = (index: number) => options?.[index]

  $: currentValue = options?.[values[0]]

  $: {
    let index = options?.findIndex(i => i === value)
    values = [index]
  }
</script>

<!-- MARKUP -->
<section class="range">
  <label>
    {label} <span>{format(currentValue)}</span>
    {afterLabel || ''}
  </label>

  <RangeSlider
    bind:values
    on:change={() => value = getValue(values[0])}
    pips
    min={0}
    max={options.length-1}
    />
</section>

<!-- STYLES -->
<style lang="scss">
  :global(.rangeSlider.pips) {
    flex: 1 100%;
    margin: 0.7rem 0.2rem;

    --range-handle-focus: var(--blue);
  }

  :global(.rangeSlider .rangeHandle) {
    height: 25px;
    width: 25px;
  }

  :global(.rangeNub) {
    border: 3px solid var(--background-color);
  }

  label {
    display: flex;
    flex-flow: row wrap;
    align-items: baseline;
    margin-bottom: 0;
  }

  span {
    margin-left: 0rem;
    margin-right: 0.2rem;
    font-size: 1.5rem;
    color: var(--accent-color);
  }

  .range {
    margin-bottom: 0.5rem;
  }
</style>
