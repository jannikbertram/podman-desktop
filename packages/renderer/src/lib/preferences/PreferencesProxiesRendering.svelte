<script lang="ts">
import type { ProxySettings } from '@podman-desktop/api';
import { onMount } from 'svelte';
import SettingsPage from './SettingsPage.svelte';
import Button from '../ui/Button.svelte';
import { faPen } from '@fortawesome/free-solid-svg-icons';

let proxySettings: ProxySettings;
let proxyState: boolean;

onMount(async () => {
  proxySettings = await window.getProxySettings();
  proxyState = await window.isProxyEnabled();
});

async function updateProxySettings() {
  await window.updateProxySettings(proxySettings);

  // loop over all providers and container connections to see if there are any running engines
  const providerInfos = await window.getProviderInfos();
  const runningProviders =
    providerInfos.filter(p => p.containerConnections.filter(c => c.status !== 'stopped').length > 0).length > 0;

  // show a simple message to confirm that the settings are applied,
  // or a longer warning if the user may need to take action
  let message = 'Proxy settings have been applied.';
  let type = 'info';
  if (runningProviders) {
    message += ' You might need to restart running container engines for the changes to take effect.';
    type = 'warning';
  }

  window.showMessageBox({
    title: 'Proxy Settings',
    type: type,
    message: message,
    buttons: ['OK'],
  });
}

async function updateProxyState() {
  await window.setProxyState(proxyState);
}
</script>

<SettingsPage title="Proxy Settings">
  <div class="flex flex-col bg-charcoal-600 rounded-md p-3 space-y-2">
    <!-- if proxy is not enabled, display a toggle -->

    <label for="toggle-proxy" class="inline-flex relative items-center mt-1 mb-4 cursor-pointer">
      <input
        type="checkbox"
        bind:checked="{proxyState}"
        on:change="{() => updateProxyState()}"
        id="toggle-proxy"
        class="sr-only peer" />
      <div
        class="w-9 h-5 peer-focus:ring-violet-800 rounded-full peer bg-zinc-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-900 peer-checked:bg-violet-600">
      </div>
      <span class="ml-3 text-sm font-medium text-gray-400"
        >Proxy configuration {proxyState ? 'enabled' : 'disabled'}</span>
    </label>

    {#if proxySettings}
      <div class="space-y-2">
        <label
          for="httpProxy"
          class="mb-2 text-sm font-medium {proxyState
            ? 'text-gray-400 dark:text-gray-400'
            : 'text-gray-900 dark:text-gray-900'}">Web Proxy (HTTP):</label>
        <input
          name="httpProxy"
          id="httpProxy"
          disabled="{!proxyState}"
          bind:value="{proxySettings.httpProxy}"
          class="w-full p-2 outline-none text-sm bg-charcoal-800 rounded-sm text-gray-700 placeholder-gray-700"
          required />
      </div>
      <div class="space-y-2">
        <label
          for="httpsProxy"
          class="pt-4 mb-2 text-sm font-medium {proxyState
            ? 'text-gray-400 dark:text-gray-400'
            : 'text-gray-900 dark:text-gray-900'}">Secure Web Proxy (HTTPS):</label>
        <input
          name="httpsProxy"
          id="httpsProxy"
          disabled="{!proxyState}"
          bind:value="{proxySettings.httpsProxy}"
          class="w-full p-2 outline-none text-sm bg-charcoal-800 rounded-sm text-gray-700 placeholder-gray-700"
          required />
      </div>
      <div class="space-y-2">
        <label
          for="httpProxy"
          class="pt-4 mb-2 text-sm font-medium {proxyState
            ? 'text-gray-400 dark:text-gray-400'
            : 'text-gray-900 dark:text-gray-900'}">Bypass proxy settings for these hosts and domains:</label>
        <input
          name="noProxy"
          id="noProxy"
          disabled="{!proxyState}"
          bind:value="{proxySettings.noProxy}"
          placeholder="Example: *.domain.com, 192.168.*.*"
          class="w-full p-2 outline-none text-sm bg-charcoal-800 rounded-sm text-gray-700 placeholder-gray-700"
          required />
      </div>
      <div class="my-2 pt-4">
        <Button on:click="{() => updateProxySettings()}" disabled="{!proxyState}" class="w-full" icon="{faPen}">
          Update
        </Button>
      </div>
    {/if}
  </div>
</SettingsPage>
