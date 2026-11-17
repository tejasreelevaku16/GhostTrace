
import {
  createSystem,
  UIKitMLAsset,
  VisibilityState,
} from '@iwsdk/core';

export class PanelSystem extends createSystem({}) {
  init(): void {
    const panel =
      this.world.getSceneObject<UIKitMLAsset>('welcome-panel');

    if (!panel) {
      console.error('GHOST TRACE: Investigation panel not found.');
      return;
    }

    const get = (id: string) => panel.getElementById(id);

    const eyebrow = get('eyebrow');
    const heading = get('heading');
    const body = get('body');
    const detail = get('detail');

    const primary = get('primary-button');
    const next = get('next-button');
    const isolate = get('isolate-button');
    const ignore = get('ignore-button');
    const restart = get('restart-button');

    const xrButton = get('xr-button');
    const exitButton = get('exit-button');

    const controls = [
      primary,
      next,
      isolate,
      ignore,
      restart,
    ];

    const showOnly = (active: typeof primary): void => {
      controls.forEach((control) => {
        control?.setProperties({
          display: control === active ? 'flex' : 'none',
        });
      });
    };

    const setScreen = (
      label: string,
      title: string,
      description: string,
      status: string,
      active: typeof primary,
    ): void => {
      eyebrow?.setProperties({ text: label });
      heading?.setProperties({ text: title });
      body?.setProperties({ text: description });
      detail?.setProperties({ text: status });
      showOnly(active);
    };

    const briefing = (): void => {
      setScreen(
        'GHOST TRACE // CYBER FORENSICS',
        'HOSPITAL NETWORK BREACH',
        'A cyberattack has disrupted the hospital network. Suspicious activity has been detected in the hospital authentication system.',
        'MISSION STATUS: NOT STARTED',
        primary,
      );
    };

    const evidence = (): void => {
      setScreen(
        'GHOST TRACE // EVIDENCE 01',
        'SUSPICIOUS LOGIN ACTIVITY',
        'Multiple failed login attempts were recorded. Source IP: 203.0.113.42. Target accounts: admin, root and administrator. Four failed attempts occurred within five minutes.',
        'CLUE FOUND: POSSIBLE BRUTE-FORCE ATTACK',
        next,
      );
    };

    const reconstruction = (): void => {
      setScreen(
        'GHOST TRACE // ATTACK TIMELINE',
        'RECONSTRUCT THE ATTACK',
        '02:13 - Repeated failed logins. 02:16 - Successful login. 02:21 - Unusual access to another internal system. 02:29 - Unexpected outbound data transfer.',
        'YOUR TASK: IDENTIFY THE SAFEST RESPONSE',
        next,
      );
    };

    const decision = (): void => {
      setScreen(
        'GHOST TRACE // INCIDENT RESPONSE',
        'MAKE YOUR DECISION',
        'A compromised account may have access to sensitive hospital systems. What should the incident response team do first?',
        'SELECT ONE RESPONSE',
        isolate,
      );

      ignore?.setProperties({ display: 'flex' });
    };

    const outcome = (correct: boolean): void => {
      setScreen(
        'GHOST TRACE // MISSION RESULT',
        correct ? 'THREAT CONTAINED' : 'INCORRECT RESPONSE',
        correct
          ? 'Correct! Isolating the compromised server helps contain the incident while the security team investigates the affected account and systems.'
          : 'Ignoring the alert leaves the suspicious activity uncontained. A security team should investigate and contain the potential compromise.',
        correct
          ? 'MISSION COMPLETE'
          : 'MISSION FAILED - REVIEW THE EVIDENCE',
        restart,
      );
    };

    const onStart = (): void => evidence();
    const onNext = (): void => {
      if (heading) {
        // Move from evidence to timeline, then from timeline to decision.
        const current = (heading as any).text;
        if (current === 'SUSPICIOUS LOGIN ACTIVITY') {
          reconstruction();
        } else {
          decision();
        }
      }
    };

    const onIsolate = (): void => outcome(true);
    const onIgnore = (): void => outcome(false);
    const onRestart = (): void => briefing();

    primary?.addEventListener('click', onStart);
    next?.addEventListener('click', onNext);
    isolate?.addEventListener('click', onIsolate);
    ignore?.addEventListener('click', onIgnore);
    restart?.addEventListener('click', onRestart);

    if (this.world.xrEnabled) {
      const launchXR = () => this.world.launchXR();
      const exitXR = () => this.world.exitXR();

      xrButton?.addEventListener('click', launchXR);
      exitButton?.addEventListener('click', exitXR);

      this.cleanupFuncs.push(
        () => xrButton?.removeEventListener('click', launchXR),
        () => exitButton?.removeEventListener('click', exitXR),
        this.world.visibilityState.subscribe((state) => {
          const is2D = state === VisibilityState.NonImmersive;
          xrButton?.setProperties({
            display: is2D ? 'flex' : 'none',
          });
          exitButton?.setProperties({
            display: is2D ? 'none' : 'flex',
          });
        }),
      );
    } else {
      xrButton?.setProperties({ display: 'none' });
      exitButton?.setProperties({ display: 'none' });
    }

    this.cleanupFuncs.push(
      () => primary?.removeEventListener('click', onStart),
      () => next?.removeEventListener('click', onNext),
      () => isolate?.removeEventListener('click', onIsolate),
      () => ignore?.removeEventListener('click', onIgnore),
      () => restart?.removeEventListener('click', onRestart),
    );

    briefing();
    console.log('GHOST TRACE: Investigation initialized.');
  }
}
