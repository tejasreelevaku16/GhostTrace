
/**
 * GHOST TRACE
 * Immersive Cybersecurity Investigation Experience
 */

import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { PanelSystem } from './panel.js';

async function startGhostTrace(): Promise<void> {
  const sceneContainer = document.getElementById('scene-container');

  if (!sceneContainer) {
    throw new Error('GHOST TRACE: Scene container not found.');
  }

  try {
    const world = await World.create(
      sceneContainer as HTMLDivElement,
      projectOptions,
    );

    world.registerSystem(PanelSystem);

    console.log('GHOST TRACE initialized successfully.');
  } catch (error) {
    console.error('GHOST TRACE initialization failed:', error);
  }
}

startGhostTrace();
