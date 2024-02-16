<script context="module">
  import { subscribe } from '../helpers/subscribe'
  
  export class Tracker {
    constructor(dataModel) {
      this.timer = new Timer()
      this.data = dataModel
      this.data.countdown = false
      this.data.startValues = {hours: 0, minutes: 0, seconds: 0}
      this.data.value = 0
    }
    store() {
      return this._store = subscribe()
    }
    clock() {
      if (
        this.data.countdown && 
        this.timer.getTimeValues().seconds == 0 &&
        this.timer.getTimeValues().minutes == 0 &&
        this.timer.getTimeValues().hours == 0
      ) {
        this.timer.stop()
        clearInterval(this.interval)
        delete this.interval
        this.data.state = 'timeout'
        window.alert('Your timer is out!')
      }
      this.data.time.sec = String(this.timer.getTimeValues().seconds).padStart(2, '0')
      this.data.time.min = String(this.timer.getTimeValues().minutes).padStart(2, '0')
      this.data.time.hr = String(this.timer.getTimeValues().hours).padStart(2, '0')
      this._store.set(this.data)
    }
    start() {
      if (this.data.state == 'running') {
        this.clock()
        return
      }
      this.timer.start({countdown: this.data.countdown, startValues: this.data.startValues})
      this.data.state = 'running'
      this._store.set(this.data)
      if (this.interval) return
      this.clock()
      this.interval = setInterval(() => {
        if (this.data.state == 'paused') return
        this.clock()
      }, 1000)
    }
    pause() {
      this.timer.pause()
      this.data.state = 'paused'
      function msCalc(h, m, s) {
        return Math.floor(h*60*60*1000) + Math.floor(m*60*1000) + Math.floor(s*1000)
      }
      function msToTime(ms) {
        let seconds = Math.floor(ms/1000)
        let minutes = Math.floor(seconds/60)
        let hours = Math.floor(minutes/60)
        seconds = seconds % 60
        minutes = minutes % 60
        return {
          h: hours,
          m: minutes,
          s: seconds
        }
      }
      let 
        hStart = this.data.startValues.hours,
        mStart = this.data.startValues.minutes,
        sStart = this.data.startValues.seconds
      let
        h = this.timer.getTimeValues().hours,
        m = this.timer.getTimeValues().minutes,
        s = this.timer.getTimeValues().seconds,
        stTime = msCalc(hStart, mStart, sStart),
        enTime = msCalc(h, m, s)
      this.data.value = Math.abs(enTime - stTime)
      this.data.value_h = msToTime(this.data.value).h
      this.data.value_m = msToTime(this.data.value).m
      this.data.value_s = msToTime(this.data.value).s
      this._store.set(this.data)
    }
    reset() {
      this.timer.stop()
      clearInterval(this.interval)
      delete this.interval
      this.data.state = 'off'
      this._store.set(this.data)
      if (!this.data.countdown) {
        this.clock()
      }
    }
    timerModeToggle() {
      this.reset()
      this.data.startValues = {hours: 0, minutes: 0, seconds: 0}
      this.data.countdown = this.data.countdown ? false : true
      this._store.set(this.data)
    }
    timerValues(sec, min, hr) {
      this.data.startValues = {
        hours: parseInt(hr),
        minutes: parseInt(min),
        seconds: parseInt(sec)
      }
      this._store.set(this.data)
    }
    submit() {
      this.pause()
    }
  }
</script>

<script>
  import { collection, getDocs } from 'firebase/firestore'
  import { getContext } from 'svelte'
  import { fade } from 'svelte/transition'
  import { Timer } from 'easytimer.js'
	import Container from '../components/Container.svelte'
	import Block from '../components/Block.svelte'
	import PageTitle from '../components/PageTitle.svelte'
  import Button from '../components/Button.svelte'
  import { ModalHandler } from '../components/Modal.svelte'
  import { pagesTexts } from '../data/pagesTexts'
  import ItemsDetails from './ItemsDetails.svelte'

  export let tracker, trackerStore, authStore, snackBarHandler, createAccountHandler, logInHandler, timerSecStore, timerMinStore, timerHrStore
  let db = getContext('db')
  export let currentPage = 'tracked_time'

  export let modalHandler = new ModalHandler()

  function submit() {
    tracker.submit()
    setTimeout(function() {
      dataModelModal.data.value_h = $trackerStore.value_h ? $trackerStore.value_h : '0'
      dataModelModal.data.value_m = $trackerStore.value_m ? $trackerStore.value_m : '0'
      dataModelModal.data.value_s = $trackerStore.value_s ? $trackerStore.value_s : '0'
      dataModelModal.data.tracked_time = $trackerStore.value
      modalDataStore.set(dataModelModal.data)
      setTimeout(function() {
        modalHandler.action()
      }, 100);
    }, 100);
  }

  function reset() {
    tracker.reset()
    timerSecStore.set({val: '00'})
    timerMinStore.set({val: '00'})
    timerHrStore.set({val: '00'})
    tracker.timerValues('00', '00', '00')
    if (modalHandler.data.open) modalHandler.action()
  }

  function modeToggle() {
    tracker.timerModeToggle()
    timerSecStore.set({val: '00'})
    timerMinStore.set({val: '00'})
    timerHrStore.set({val: '00'})
  }

  function timerEditing(type, store, val) {
    let valTreat = (`00${val.replace(/[^0-9]/g, '')}`).slice(-2)
    if (['sec', 'min'].includes(type)) {
      let ten = valTreat.slice(0,1)
      ten = parseInt(ten) > 5 ? 5 : ten
      valTreat = `${ten}${valTreat.slice(1,2)}`
    }
    store.set({val: valTreat})
    tracker.timerValues($timerSecStore.val, $timerMinStore.val, $timerHrStore.val)
    if ($trackerStore.state == 'timeout') return
  }

  let dataModelModal = {
    data: {
      currentPage,
      title: pagesTexts[currentPage].newModalTitle,
      subtitle: pagesTexts[currentPage].newModalSubtitle,
      value_h: null,
      value_m: null,
      value_s: null,
      tracked_time: null,
    }
  }
  export let modalDataStore = subscribe()
  modalDataStore.set(dataModelModal.data)

  let queryData = {
    data: {
      content: null,
      page: null
    }
  }
  export let subitemsSnapshot = subscribe()
  subitemsSnapshot.set(queryData.data)
  $: if ($authStore.user) {
    getDocs(collection(db, `projects/user_${$authStore.user.uid}/items_${$authStore.user.uid}`))
      .then((querySnapshot) => {
        subitemsSnapshot.set({content: querySnapshot, page: 'projects'})
      })
  } else {
    subitemsSnapshot.set({content: {docs:[]}, page: 'projects'})
  }
</script>

<Container spacing=24>
	<PageTitle
		title="Time Tracker"
		subtitle="Keep track of your work time"
	/>
</Container>
<div class="tracker-wrap">
  <Container style="height: 100%; align-content: center; position: relative;">
    <Block l=100>
      <Container spacing=24 style="justify-content: center">
        <Block>
          {#if !['off', 'timeout'].includes($trackerStore.state)}
            <div class="clock" in:fade={{ duration: 200 }}
              on:click={$trackerStore.state != 'running' ? tracker.start.bind(tracker): tracker.pause.bind(tracker)}
            >
              <div class="ten">
                <div class="title">
                  Hours
                </div>
                <span>{$trackerStore.time.hr}</span>
              </div>
              <div class="dots">:</div>
              <div class="ten">
                <div class="title">
                  Minutes
                </div>
                <span>{$trackerStore.time.min}</span>
              </div>
              <div class="dots">:</div>
              <div class="ten">
                <div class="title">
                  Seconds
                </div>
                <span>{$trackerStore.time.sec}</span>
              </div>
            </div>
          {:else if ['off', 'timeout'].includes($trackerStore.state) && $trackerStore.countdown}
            <div class="clock timer-mode" in:fade={{ duration: 200 }}>
              <div class="ten">
                <div class="title">
                  Hours
                </div>
                <input id="timer-hr"
                bind:value={$timerHrStore.val}
                  on:input={timerEditing('hr', timerHrStore, this.value)}
                >
              </div>
              <div class="dots">:</div>
              <div class="ten">
                <div class="title">
                  Minutes
                </div>
                <input id="timer-min"
                  bind:value={$timerMinStore.val}
                  on:input={timerEditing('min', timerMinStore, this.value)}
                >
              </div>
              <div class="dots">:</div>
              <div class="ten">
                <div class="title">
                  Seconds
                </div>
                <input id="timer-sec"
                  bind:value={$timerSecStore.val}
                  on:input={timerEditing('sec', timerSecStore, this.value)}
                >
              </div>
            </div>
          {:else}
            <div class="start-wrap" in:fade={{ duration: 200 }}>
              <div class="start-disc"></div>
              <div class="start-button" on:click={tracker.start.bind(tracker)}>
                <span>Start</span>
              </div>
            </div>
          {/if}
        </Block>
      </Container>
    </Block>
    <Block l=100>
      <Container spacing=24 style="justify-content: center; position: relative; z-index: 2;">
        {#if $trackerStore.state == 'off' || $trackerStore.countdown}
          <Block>
            <div class="countdown-wrap {$trackerStore.countdown ? ' timer-mode' : ''}" in:fade={{ duration: 200 }}>
              <Button
                text='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M112.91 128A191.85 191.85 0 0064 254c-1.18 106.35 85.65 193.8 192 194 106.2.2 192-85.83 192-192 0-104.54-83.55-189.61-187.5-192a4.36 4.36 0 00-4.5 4.37V152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M233.38 278.63l-79-113a8.13 8.13 0 0111.32-11.32l113 79a32.5 32.5 0 01-37.25 53.26 33.21 33.21 0 01-8.07-7.94z"/></svg>'
                style="padding-top: 6.5px; padding-bottom: 2.5px; padding-left: 6px; padding-right: 7px;"
                title="Timer Mode"
                type="button"
                classes={$trackerStore.countdown ? 'primary' : 'secondary'}
                onclick={modeToggle}
              />
            </div>
          </Block>
        {/if}
        {#if 
          $trackerStore.state == 'paused' || 
          ($trackerStore.countdown && !['running', 'timeout'].includes($trackerStore.state))
        }
          <Block>
            <div in:fade={{ duration: 200 }}>
              <Button
                text='<ion-icon name="play-outline"></ion-icon>'
                style="padding-top: 7px; padding-bottom: 2px; padding-left: 8px; padding-right: 5px;"
                title="Start"
                type="button"
                classes="secondary"
                onclick={tracker.start.bind(tracker)}
              />
            </div>
          </Block>
        {/if}
        {#if $trackerStore.state == 'running' || ($trackerStore.countdown && $trackerStore.state == 'running')}
          <Block>
            <div in:fade={{ duration: 200 }}>
              <Button
                text='<ion-icon name="pause-outline"></ion-icon>'
                style="padding-top: 7px; padding-bottom: 2px; padding-left: 6px; padding-right: 7px;"
                title="Pause"
                type="button"
                classes="secondary"
                onclick={tracker.pause.bind(tracker)}
              />
            </div>
          </Block>
        {/if}
        {#if $trackerStore.state != 'off' || $trackerStore.countdown}
          <Block>
            <div in:fade={{ duration: 200 }}>
              <Button
                text='<ion-icon name="refresh-outline"></ion-icon>'
                style="padding-top: 5px; padding-bottom: 4px; padding-left: 7px; padding-right: 6px;"
                title="Reset"
                type="button"
                classes="secondary"
                onclick={reset}
              />
            </div>
          </Block>
        {/if}
        {#if $trackerStore.state != 'off'}
          <Block>
            <div in:fade={{ duration: 200 }}>
              <Button
                text='<ion-icon name="checkmark-outline"></ion-icon>'
                style="padding-top: 6px; padding-bottom: 3px; padding-left: 7px; padding-right: 6px;"
                title="Submit"
                type="button"
                classes="secondary"
                onclick={submit}
              />
            </div>
          </Block>
        {/if}
      </Container>
    </Block>
    <div class="waves-wrap {$trackerStore.state}" in:fade={{ duration: 200 }}>
      <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"      viewBox="0 24 150 28" preserveAspectRatio="none">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 
            58-18 88-18s
            58 18 88 18 
            58-18 88-18 
            58 18 88 18
            v44h-352z">
          </path>
        </defs>
        <g class="wave1">
          <use xlink:href="#gentle-wave" x="50" y="3" fill="#7f78cf"></use>
        </g>
        <g class="wave2">
          <use xlink:href="#gentle-wave" x="50" y="0" fill="#51b0b9"></use>
        </g>
        <g class="wave3">
          <use xlink:href="#gentle-wave" x="50" y="9" fill="#9e9ea1"></use>
        </g>
        <g class="wave4">
          <use xlink:href="#gentle-wave" x="50" y="6" fill="#3d4458"></use>
        </g>
      </svg>
    </div>
    <div class="bg">
    </div>
  </Container>
</div>

<ItemsDetails
  {authStore}
  {modalHandler}
  {modalDataStore}
  {snackBarHandler}
  {subitemsSnapshot}
  {createAccountHandler}
  {logInHandler}
  formCallback={reset}
/>

<style lang="scss">
  @import '../scss/media-sizes';
  .tracker-wrap {
    height: calc(100vh - 190px);
  }
  .countdown-wrap {
    position: relative;
    z-index: 2;
    :global(svg) {
      width: 24px;
      height: 24px;
    }
    :global(path) {
      &:nth-of-type(2) {
        fill: var(--color_5);
      }
    }
    &.timer-mode {
      :global(path) {
        &:nth-of-type(2) {
          fill: #fff;
        }
      }
    }
  }
  .clock {
    position: relative;
    z-index: 2;
    line-height: 90px;
    display: flex;
    font-size: 36px;
    font-family: "Poppins";
    font-weight: 300;
    color: var(--color_42);
    text-shadow: 2px 2px 9px rgba(0,0,0,.25);
    cursor: pointer;
    .ten {
      font-size: 60px;
      margin: 0 3px;
      display: flex;
      flex-wrap: wrap;
      width: 76px;
    }
    .title {
      width: 100%;
      font-size: 12px;
      text-align: center;
      display: block;
      line-height: 1;
    }
    .dots {
      margin-top: 12px;
    }
    span {
      // width: 36px;
      width: 100%;
      text-align: center;
      font-family: 'Open Sans';
    }
    &.timer-mode {
      cursor: text;
      input {
        width: 76px;
        text-align: center;
        font-family: 'Open Sans';
      }
    }
  }
  .start-wrap {
    margin-top: 40px;
    border-radius: 50%;
    position: relative;
    z-index: 2;
    width: 180px;
    height: 180px;
    box-shadow: 3px 12px 48px 3px rgba(0,0,0,.2);
  }
  .start-disc {
    background: linear-gradient(140deg, var(--color_5) 0%, var(--color_6) 100%);
    border-radius: 50%;
    animation:spin 3s linear infinite;
    width: 100%;
    height: 100%;
  }
  .start-button {
    position: absolute;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    top: 3px;
    left: 3px;
    cursor: pointer;
    border-radius: 50%;
    background-color: var(--color_40);
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      color: var(--color_41);
      font-family: "Poppins";
      font-weight: 300;
      font-size: 36px;
    }
    :global(ion-icon) {
      color: var(--color_41);
      display: block;
      width: 60px;
      height: 60px;
      margin-left: 9px;
    }
  }
  @keyframes spin { 
    100% { 
      transform:rotate(360deg); 
    } 
  }
  .bg {
    width: calc(100vw - 260px);
    height: calc(50% + 36px);
    position: absolute;
    top: calc(50% + 60px);
    background-color: #3d4458;
    z-index: 0;
    opacity: 0.1;
    left: 50%;
    margin-left: calc((100vw - 260px)/2 * -1);
  }
  .waves-wrap {
    position: absolute;
    top: calc(50% + 60px);
    width: calc(100vw - 260px);
    left: 50%;
    margin-left: calc((100vw - 260px)/2 * -1);
    opacity: .1;
    z-index: 1;
    &.running {
      .wave1 > use {
        animation-play-state: running;
      }
      .wave2 > use {
        animation-play-state: running;
      }
      .wave3 > use {
        animation-play-state: running;
      }
      .wave4 > use {
        animation-play-state: running;
      }
    }
  }
  .waves {
    display: block;
    width: 100%;
    height: 60px;
    max-height: 60px;
    margin: 0;
    z-index:5;
    bottom:0;
    position:absolute;
    left:0px;
    float:left;
  }
  .wave1 > use {
    animation: move_forever1 10s linear infinite;
    animation-play-state: paused;
    &:nth-child(1) {
      animation-delay: -2s;
    }
  }
  .wave2 > use {
    animation: move_forever2 8s linear infinite;
    animation-play-state: paused;
    &:nth-child(1) {
      animation-delay: -2s;
    }
  }
  .wave3 > use {
    animation: move_forever3 6s linear infinite;
    animation-play-state: paused;
    &:nth-child(1) {
      animation-delay: -2s;
    }
  }
  .wave4 > use {
    animation: move_forever4 4s linear infinite;
    animation-play-state: paused;
    &:nth-child(1) {
      animation-delay: -2s;
    }
  }
  @keyframes move_forever1 {
    0% {
      transform: translate(85px, 0%);
    }
    100% {
      transform: translate(-90px, 0%);
    }
  }
  @keyframes move_forever2 {
    0% {
      transform: translate(-90px, 0%);
    }
    100% {
      transform: translate(85px, 0%);
    }
  }
  @keyframes move_forever3 {
    0% {
      transform: translate(85px, 0%);
    }
    100% {
      transform: translate(-90px, 0%);
    }
  }
  @keyframes move_forever4 {
    0% {
      transform: translate(-90px, 0%);
    }
    100% {
      transform: translate(85px, 0%);
    }
  }
  @media screen and (max-width: $mediaQueryMid) {
    .tracker-wrap {
      height: calc(100vh - 330px);
    }
    .bg {
      width: 100vw;
      height: calc(50% + 9px);
      left: 0;
      margin-left: 0;
    }
    .waves-wrap {
      position: absolute;
      width: 100vw;
      margin-left: 0;
      left: 0;
    }

  }
</style>