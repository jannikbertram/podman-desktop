<script lang="ts">
import type { StatusBarEntry } from '../../../../main/src/plugin/statusbar/statusbar-registry';
import { iconClass } from './StatusBarItem';

export let entry: StatusBarEntry;

function tooltipText(entry: StatusBarEntry): string {
  return entry.tooltip !== undefined ? entry.tooltip : '';
}

function opacity(entry: StatusBarEntry): string {
  return entry.enabled ? 'opacity-100' : 'opacity-25';
}

function hoverBackground(entry: StatusBarEntry): string {
  return entry.enabled && typeof entry.command === 'string' ? 'hover:bg-[#4d3782]' : '';
}

function hoverCursor(entry: StatusBarEntry): string {
  return entry.enabled && typeof entry.command === 'string' ? 'hover:cursor-pointer' : '';
}

async function executeCommand(entry: StatusBarEntry) {
  if (typeof entry.command === 'undefined') {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await window.executeStatusBarEntryCommand(entry.command, entry.commandArgs);
}
</script>

<button
  on:click="{() => {
    executeCommand(entry);
  }}"
  class="{opacity(entry)} px-1 {hoverBackground(entry)} {hoverCursor(entry)}"
  title="{tooltipText(entry)}">
  {#if iconClass(entry)}
    <span class="{iconClass(entry)}" aria-hidden="true"></span>
  {/if}
  {#if entry.text}
    <span class="ml-1">{entry.text}</span>
  {/if}
</button>
