import { GameClient, IInputEvent, IScreenInput } from '@mixer/interactive-node';
import translateCoordinatesToScreen from '../helpers/mixplay/translateCoordinatesToScreen';
import addBalls from '../helpers/phaser/addBalls';
import { GameScenes, MixplayGroups, MixplayScenes } from '../constants';

class Interactive {
  private session: GameClient;
  private readonly debugMode: boolean;

  constructor() {
    this.session = new GameClient();
    this.debugMode = false;
  }

  public setup(token: string, callback: () => void): void {
    this.session.open({
      authToken: token,
      versionId: +process.env.API_VERSION_ID
    });

    this.session.on('open', async () => {
      await this.session.synchronizeState();

      this.onDebug();
      this.handleParticipant();

      await this.session.ready(true);

      callback();
    });
  }

  public resume(): void {
    this.updateSceneOnGroup(MixplayGroups.Default, MixplayScenes.Game);
  }

  public pause(): void {
    this.updateSceneOnGroup(MixplayGroups.Default, MixplayScenes.Pause);
  }

  public onMenu(): void {
    this.updateSceneOnGroup(MixplayGroups.Default, MixplayScenes.Menu);
  }

  public onGame(scene: Phaser.Scene): void {
    this.updateSceneOnGroup(MixplayGroups.Default, MixplayScenes.Game);

    this.onMouseDown(scene);
  }

  private onDebug(): void {
    if (this.debugMode) {
      this.session.on('message', (err: any) => console.log('<<<', err));
      this.session.on('send', (err: any) => console.log('>>>', err));
      this.session.on('error', (err: any) => console.log(err));
    }
  }

  private handleParticipant(): void {
    this.session.state.on('participantJoin', participant => {
      console.log(`${participant.username}(${participant.sessionID}) Joined`);
    });
    this.session.state.on('participantLeave', (participantSessionID: string, participant: any) => {
      console.log(`${participant.username}(${participantSessionID}) Left`);
    });
  }

  private onMouseDown(scene: Phaser.Scene): void {
    const control = this.session.state.getControl('Drop balls');
    control.removeAllListeners();

    control.on('mousedown', (inputEvent: IInputEvent<IScreenInput>) => {
      const { x, y } = translateCoordinatesToScreen(scene, inputEvent.input.x, inputEvent.input.y);
      addBalls(scene, x, y);
    });
  }

  private updateSceneOnGroup(groupID: string, sceneID: string): void {
    const defaultGroup = this.session.state.getGroup(groupID);
    defaultGroup.sceneID = sceneID;

    this.session.updateGroups({
      groups: [defaultGroup]
    });
  }
}

export default Interactive;
