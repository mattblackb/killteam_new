import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_ARMY_ID, KILL_TEAM_ARMIES } from "./data/killTeams";
import { loadAppState, saveBattleState, saveDraftRoster, saveSavedArmies, saveDashboardLayout, saveBattleDashboardLayout } from "./lib/storage";
import { clamp, createId, toDataUrl } from "./utils/helpers";
import { hydrateMembers } from "./utils/operativeUtils";
import { createBattleArmy, normalizeBattleState } from "./utils/battleUtils";
import BuilderPage from "./pages/BuilderPage";
import OverviewPage from "./pages/OverviewPage";
import BattlePage from "./pages/BattlePage";
import DashboardPage from "./pages/DashboardPage";
import BattleDashboardPage from "./pages/BattleDashboardPage";

const WRECKA_KREW_LIMITS = {
  "Wrecka Krew Boss Nob": 1,
  "Wrecka Krew Bomb Squig": 2,
  "Breaka Boy Demolisha": 1,
  "Breaka Boy Fighter": 5,
  "Breaka Boy Krusha": 1,
  "Tankbusta Gunner": 5,
  "Tankbusta Rokkiteer": 1
};

// Raveners: 1 Prime + 4 from pool; non-Warrior pool operatives max 1 each, Warrior fills remaining
const RAVENERS_LIMITS = {
  "Ravener Prime": 1,
  "Ravener Felltalon": 1,
  "Ravener Tremorscythe": 1,
  "Ravener Venomspitter": 1,
  "Ravener Warrior": 4,
  "Ravener Wrecker": 1
};

// Murderwing: 1 Chaos Lord + 7 from pool; non-Raptor operatives max 1 each; max 2 plasma, max 2 melta
const MURDERWING_LIMITS = {
  "Murderwing Chaos Lord": 1,
  "Murderwing Champion": 1,
  "Murderwing Curseclaw": 1,
  "Murderwing Depredator": 1,
  "Murderwing Huntmaster": 1,
  "Murderwing Raptor": 7,
  "Murderwing Shrieker": 1,
  "Murderwing Skysear": 1,
  "Murderwing Warp Talon": 1
};

function isWreckaKrew(armyId) {
  return armyId === "wrecka-krew";
}

function isRaveners(armyId) {
  return armyId === "raveners";
}

function isMurderwing(armyId) {
  return armyId === "murderwing";
}

export default function App() {
  const [screen, setScreen] = useState("builder");
  const [armyId, setArmyId] = useState(DEFAULT_ARMY_ID);
  const [armyName, setArmyName] = useState("");
  const [armyNotes, setArmyNotes] = useState("");
  const [memberNotes, setMemberNotes] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberLoadout, setMemberLoadout] = useState("");
  const [cardFile, setCardFile] = useState(null);
  const [cardFile2, setCardFile2] = useState(null);
  const [members, setMembers] = useState([]);
  const [savedArmies, setSavedArmies] = useState([]);
  const [error, setError] = useState("");
  const [selectedTacOpIds, setSelectedTacOpIds] = useState([]);
  const [editingArmyId, setEditingArmyId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveArmyMessage, setSaveArmyMessage] = useState("");
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [selectedOverviewArmyIds, setSelectedOverviewArmyIds] = useState([]);
  const [battleState, setBattleState] = useState(null);
  const [dashboardLayout, setDashboardLayout] = useState(null);
  const [battleDashboardLayout, setBattleDashboardLayout] = useState(null);
  const hasHydratedRef = useRef(false);

  const selectedArmy = useMemo(
    () => KILL_TEAM_ARMIES.find((army) => army.id === armyId) ?? KILL_TEAM_ARMIES[0],
    [armyId]
  );

  const selectedOperative = useMemo(
    () => selectedArmy.operatives.find((operative) => operative.name === memberName) ?? null,
    [memberName, selectedArmy]
  );

  const operativeAvailability = useMemo(() => {
    const countsByOperative = members.reduce((acc, member) => {
      acc[member.operative] = (acc[member.operative] ?? 0) + 1;
      return acc;
    }, {});

    const totalMembers = members.length;

    return selectedArmy.operatives.reduce((acc, operative) => {
      if (!isWreckaKrew(selectedArmy.id) && !isRaveners(selectedArmy.id) && !isMurderwing(selectedArmy.id)) {
        acc[operative.name] = { disabled: false, reason: "" };
        return acc;
      }

      if (isWreckaKrew(selectedArmy.id)) {
        const maxCount = WRECKA_KREW_LIMITS[operative.name] ?? 1;
        const currentCount = countsByOperative[operative.name] ?? 0;

        if (totalMembers >= 8) {
          acc[operative.name] = { disabled: true, reason: "Roster is full (8/8)." };
          return acc;
        }

        if (currentCount >= maxCount) {
          acc[operative.name] = {
            disabled: true,
            reason: `Maximum reached (${currentCount}/${maxCount}).`
          };
          return acc;
        }

        acc[operative.name] = {
          disabled: false,
          reason: `Selected ${currentCount}/${maxCount}`
        };
        return acc;
      }

      if (isRaveners(selectedArmy.id)) {
        const maxCount = RAVENERS_LIMITS[operative.name] ?? 1;
        const currentCount = countsByOperative[operative.name] ?? 0;
        // Total roster is 5 (1 Prime + 4 pool)
        const primeCount = countsByOperative["Ravener Prime"] ?? 0;
        const poolCount = totalMembers - primeCount;

        if (totalMembers >= 5) {
          acc[operative.name] = { disabled: true, reason: "Roster is full (5/5)." };
          return acc;
        }

        // Prime must be added first and only once
        if (operative.name === "Ravener Prime") {
          if (currentCount >= 1) {
            acc[operative.name] = { disabled: true, reason: "Maximum reached (1/1)." };
          } else {
            acc[operative.name] = { disabled: false, reason: "Required (0/1)" };
          }
          return acc;
        }

        // Pool operatives require the Prime to be added first
        if (primeCount === 0) {
          acc[operative.name] = { disabled: true, reason: "Add Ravener Prime first." };
          return acc;
        }

        if (poolCount >= 4) {
          acc[operative.name] = { disabled: true, reason: "Pool is full (4/4)." };
          return acc;
        }

        if (currentCount >= maxCount) {
          acc[operative.name] = {
            disabled: true,
            reason: `Maximum reached (${currentCount}/${maxCount}).`
          };
          return acc;
        }

        acc[operative.name] = {
          disabled: false,
          reason: `Selected ${currentCount}/${maxCount}`
        };
        return acc;
      }

      if (isMurderwing(selectedArmy.id)) {
        const maxCount = MURDERWING_LIMITS[operative.name] ?? 1;
        const currentCount = countsByOperative[operative.name] ?? 0;
        const lordCount = countsByOperative["Murderwing Chaos Lord"] ?? 0;
        const poolCount = totalMembers - lordCount;

        if (totalMembers >= 8) {
          acc[operative.name] = { disabled: true, reason: "Roster is full (8/8)." };
          return acc;
        }

        if (operative.name === "Murderwing Chaos Lord") {
          if (currentCount >= 1) {
            acc[operative.name] = { disabled: true, reason: "Maximum reached (1/1)." };
          } else {
            acc[operative.name] = { disabled: false, reason: "Required (0/1)" };
          }
          return acc;
        }

        if (lordCount === 0) {
          acc[operative.name] = { disabled: true, reason: "Add Murderwing Chaos Lord first." };
          return acc;
        }

        if (poolCount >= 7) {
          acc[operative.name] = { disabled: true, reason: "Pool is full (7/7)." };
          return acc;
        }

        if (currentCount >= maxCount) {
          acc[operative.name] = {
            disabled: true,
            reason: `Maximum reached (${currentCount}/${maxCount}).`
          };
          return acc;
        }

        acc[operative.name] = {
          disabled: false,
          reason: `Selected ${currentCount}/${maxCount}`
        };
        return acc;
      }

      acc[operative.name] = { disabled: false, reason: "" };
      return acc;
    }, {});
  }, [members, selectedArmy]);

  // --- Hydration ---

  useEffect(() => {
    let isMounted = true;

    async function hydrateState() {
      try {
        const appState = await loadAppState();
        if (!isMounted) {
          return;
        }

        if (appState.draftRoster) {
          setArmyId(appState.draftRoster.armyId || DEFAULT_ARMY_ID);
          setArmyName(appState.draftRoster.armyName || "");
          setArmyNotes(appState.draftRoster.armyNotes || "");
          setSelectedTacOpIds(
            Array.isArray(appState.draftRoster.selectedTacOpIds)
              ? appState.draftRoster.selectedTacOpIds
              : []
          );
          setMembers(
            hydrateMembers(
              appState.draftRoster.armyId || DEFAULT_ARMY_ID,
              Array.isArray(appState.draftRoster.members) ? appState.draftRoster.members : []
            )
          );
        }

        setSavedArmies(
          Array.isArray(appState.savedArmies)
            ? appState.savedArmies.map((army) => ({
                ...army,
                members: hydrateMembers(army.armyId, army.members)
              }))
            : []
        );
        setBattleState(normalizeBattleState(appState.battleState));
        setDashboardLayout(Array.isArray(appState.dashboardLayout) ? appState.dashboardLayout : null);
        setBattleDashboardLayout(Array.isArray(appState.battleDashboardLayout) ? appState.battleDashboardLayout : null);
      } catch {
        if (isMounted) {
          setStorageError("Persistent storage could not be opened. Your roster will only last for this session.");
        }
      } finally {
        if (isMounted) {
          hasHydratedRef.current = true;
          setIsLoadingState(false);
        }
      }
    }

    hydrateState();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- Persistence ---

  useEffect(() => {
    setMemberName("");
    setMemberLoadout("");
    setSelectedTacOpIds([]);
  }, [armyId]);

  useEffect(() => {
    if (!selectedOperative?.loadoutOptions?.length) {
      if (memberLoadout) {
        setMemberLoadout("");
      }
      return;
    }

    if (!selectedOperative.loadoutOptions.includes(memberLoadout)) {
      setMemberLoadout(selectedOperative.loadoutOptions[0]);
    }
  }, [selectedOperative, memberLoadout]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    saveDraftRoster({ armyId, armyName, armyNotes, members, selectedTacOpIds }).catch(() => {
      setStorageError("Changes could not be saved locally. Try smaller images or refresh the page.");
    });
  }, [armyId, armyName, armyNotes, members, selectedTacOpIds]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    saveSavedArmies(savedArmies).catch(() => {
      setStorageError("Saved armies could not be updated locally. Refresh and try again.");
    });
  }, [savedArmies]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    saveBattleState(battleState).catch(() => {
      setStorageError("Battle tracking could not be saved locally. Refresh and try again.");
    });
  }, [battleState]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    saveDashboardLayout(dashboardLayout).catch(() => {});
  }, [dashboardLayout]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    saveBattleDashboardLayout(battleDashboardLayout).catch(() => {});
  }, [battleDashboardLayout]);

  // --- Builder handlers ---

  const handleAddMember = async (event) => {
    event.preventDefault();
    setError("");
    setSaveArmyMessage("");
    setStorageError("");

    if (!armyName.trim()) {
      setError("Give your army a name first.");
      return;
    }
    if (!memberName) {
      setError("Pick an operative from the dropdown.");
      return;
    }
    if (operativeAvailability[memberName]?.disabled) {
      setError(operativeAvailability[memberName].reason || "That operative cannot be added right now.");
      return;
    }
    if (selectedOperative?.loadoutOptions?.length > 0 && !memberLoadout) {
      setError("Pick a loadout for this operative.");
      return;
    }

    if (isMurderwing(selectedArmy.id) && memberLoadout) {
      const countWith = (keyword) =>
        members.filter((m) => (m.loadout || "").toLowerCase().includes(keyword)).length;
      if (/plasma/i.test(memberLoadout) && countWith("plasma") >= 2) {
        setError("Cannot include more than 2 operatives with plasma weapons.");
        return;
      }
      if (/melta/i.test(memberLoadout) && countWith("melta") >= 2) {
        setError("Cannot include more than 2 operatives with melta weapons.");
        return;
      }
    }

    if (!cardFile) {
      setError("Upload a card image for this operative.");
      return;
    }

    try {
      setSaving(true);
      const imageDataUrl = await toDataUrl(cardFile);
      const secondImageDataUrl = cardFile2 ? await toDataUrl(cardFile2) : null;

      setMembers((current) => [
        ...current,
        {
          id: createId(),
          operative: memberName,
          wounds: selectedOperative?.wounds ?? null,
          apl: selectedOperative?.apl ?? null,
          move: selectedOperative?.move ?? "",
          save: selectedOperative?.save ?? "",
          tags: selectedOperative?.tags ?? [],
          loadout: memberLoadout || "",
          memberNotes: memberNotes.trim(),
          imageDataUrl,
          imageName: cardFile.name,
          ...(secondImageDataUrl ? { secondImageDataUrl } : {}),
          createdAt: new Date().toISOString()
        }
      ]);

      setCardFile(null);
      setCardFile2(null);
      setMemberLoadout("");
      setMemberNotes("");
      const input = document.getElementById("card-file");
      if (input) {
        input.value = "";
      }
      const input2 = document.getElementById("card-file-2");
      if (input2) {
        input2.value = "";
      }
    } catch {
      setError("Could not store the image. Try another file.");
    } finally {
      setSaving(false);
    }
  };

  const removeMember = (id) => {
    setSaveArmyMessage("");
    setMembers((current) => current.filter((member) => member.id !== id));
  };

  const clearRoster = () => {
    setArmyName("");
    setArmyNotes("");
    setMembers([]);
    setMemberNotes("");
    setMemberLoadout("");
    setSelectedTacOpIds([]);
    setCardFile(null);
    setCardFile2(null);
    setError("");
    setSaveArmyMessage("");
    const input = document.getElementById("card-file");
    if (input) {
      input.value = "";
    }
    const input2 = document.getElementById("card-file-2");
    if (input2) {
      input2.value = "";
    }
  };

  const handleArmySelectionChange = (nextArmyId) => {
    if (!nextArmyId || nextArmyId === armyId) {
      return;
    }

    const hasBuilderData =
      armyName.trim().length > 0 ||
      armyNotes.trim().length > 0 ||
      members.length > 0 ||
      selectedTacOpIds.length > 0 ||
      memberName.trim().length > 0 ||
      memberNotes.trim().length > 0 ||
      memberLoadout.trim().length > 0 ||
      !!cardFile ||
      !!cardFile2;

    if (!hasBuilderData) {
      setArmyId(nextArmyId);
      return;
    }

    const shouldReset = window.confirm(
      "Changing army will remove the current builder selection and reset this roster. Continue?"
    );

    if (!shouldReset) {
      return;
    }

    setArmyId(nextArmyId);
    setEditingArmyId(null);
    clearRoster();
  };

  const handleSaveArmy = () => {
    setError("");

    if (!armyName.trim()) {
      setError("Name your army before saving it.");
      return;
    }
    if (members.length === 0) {
      setError("Add at least one member with a card image before saving.");
      return;
    }

    if (editingArmyId) {
      setSavedArmies((current) =>
        current.map((a) =>
          a.id === editingArmyId
            ? {
                ...a,
                armyId,
                armyTypeName: selectedArmy.name,
                faction: selectedArmy.faction,
                armyName: armyName.trim(),
                armyNotes: armyNotes.trim(),
                selectedTacOpIds,
                members,
                savedAt: new Date().toISOString()
              }
            : a
        )
      );
      setEditingArmyId(null);
      setSaveArmyMessage("Army updated successfully.");
    } else {
      const nextArmy = {
        id: createId(),
        armyId,
        armyTypeName: selectedArmy.name,
        faction: selectedArmy.faction,
        armyName: armyName.trim(),
        armyNotes: armyNotes.trim(),
        selectedTacOpIds,
        members,
        savedAt: new Date().toISOString()
      };
      setSavedArmies((current) => [nextArmy, ...current]);
      setSaveArmyMessage("Army saved. You can find it in Overview.");
    }
    setScreen("overview");
  };

  const handleEditArmy = (army) => {
    setArmyId(army.armyId);
    setArmyName(army.armyName);
    setArmyNotes(army.armyNotes || "");
    setMembers(army.members);
    setSelectedTacOpIds(army.selectedTacOpIds || []);
    setEditingArmyId(army.id);
    setError("");
    setSaveArmyMessage("");
    setScreen("builder");
  };

  // --- Overview handlers ---

  const deleteSavedArmy = (id) => {
    setSavedArmies((current) => current.filter((army) => army.id !== id));
    setSelectedOverviewArmyIds((current) => current.filter((entry) => entry !== id));
  };

  const startNewArmy = () => {
    setArmyId(DEFAULT_ARMY_ID);
    setEditingArmyId(null);
    clearRoster();
    setScreen("builder");
  };

  const formattedSavedArmies = useMemo(
    () =>
      savedArmies.map((army) => ({
        ...army,
        savedAtLabel: new Date(army.savedAt).toLocaleString()
      })),
    [savedArmies]
  );

  const selectedOverviewArmies = useMemo(
    () => savedArmies.filter((army) => selectedOverviewArmyIds.includes(army.id)),
    [savedArmies, selectedOverviewArmyIds]
  );

  const toggleOverviewArmySelection = (id) => {
    setSelectedOverviewArmyIds((current) => {
      if (current.includes(id)) {
        return current.filter((entry) => entry !== id);
      }
      if (current.length >= 2) {
        return [...current.slice(1), id];
      }
      return [...current, id];
    });
  };

  const launchBattle = () => {
    if (selectedOverviewArmies.length === 0 || selectedOverviewArmies.length > 2) {
      setError("Select one or two armies from Overview to start tracking a game.");
      return;
    }
    setBattleState({
      turnNumber: 1,
      armies: selectedOverviewArmies.map((army) => createBattleArmy(army))
    });
    setScreen("battle");
    setError("");
  };

  // --- Battle handlers ---

  const updateBattleTurn = (delta) => {
    setBattleState((current) => {
      if (!current) {
        return current;
      }

      const nextTurnNumber = clamp(current.turnNumber + delta, 1, 10);
      const isAdvancingTurn = delta > 0 && nextTurnNumber > current.turnNumber;

      if (!isAdvancingTurn) {
        return { ...current, turnNumber: nextTurnNumber };
      }

      return {
        ...current,
        turnNumber: nextTurnNumber,
        armies: current.armies.map((army) => ({
          ...army,
          members: army.members.map((member) => ({
            ...member,
            activation: "not-activated"
          }))
        }))
      };
    });
  };

  const updateBattleArmyCounter = (battleArmyId, field, delta) => {
    setBattleState((current) => {
      if (!current) {
        return current;
      }
      return {
        ...current,
        armies: current.armies.map((army) =>
          army.id === battleArmyId
            ? { ...army, [field]: clamp((army[field] ?? 0) + delta, 0, 99) }
            : army
        )
      };
    });
  };

  const updateBattleMemberWounds = (battleArmyId, memberId, delta) => {
    setBattleState((current) => {
      if (!current) {
        return current;
      }
      return {
        ...current,
        armies: current.armies.map((army) =>
          army.id === battleArmyId
            ? {
                ...army,
                members: army.members.map((member) =>
                  member.id === memberId
                    ? {
                        ...member,
                        currentWounds: clamp(
                          (member.currentWounds ?? member.maxWounds ?? 0) + delta,
                          0,
                          member.maxWounds ?? 0
                        )
                      }
                    : member
                )
              }
            : army
        )
      };
    });
  };

  const updateBattleMemberState = (battleArmyId, memberId, stateUpdate) => {
    setBattleState((current) => {
      if (!current) return current;
      return {
        ...current,
        armies: current.armies.map((army) =>
          army.id === battleArmyId
            ? {
                ...army,
                members: army.members.map((member) =>
                  member.id === memberId ? { ...member, ...stateUpdate } : member
                )
              }
            : army
        )
      };
    });
  };

  const resetBattle = () => {
    setBattleState((current) =>
      current
        ? {
            turnNumber: 1,
            armies: current.armies.map((army) => ({
              ...army,
              victoryPoints: 0,
              commandPoints: 0,
              members: army.members.map((member) => ({
                ...member,
                currentWounds: member.maxWounds ?? member.currentWounds ?? 0
              }))
            }))
          }
        : current
    );
  };

  const endBattle = () => {
    setScreen("overview");
  };

  // --- Render ---

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Kill Team Roster Builder</p>

        <div className="screen-tabs" role="tablist" aria-label="Page views">
          <button
            type="button"
            className={`tab-button ${screen === "builder" ? "active" : ""}`}
            onClick={() => {
              setEditingArmyId(null);
              clearRoster();
              setScreen("builder");
            }}
          >
            Builder
          </button>
          <button
            type="button"
            className={`tab-button ${screen === "overview" ? "active" : ""}`}
            onClick={() => setScreen("overview")}
          >
            Overview ({savedArmies.length})
          </button>
          <button
            type="button"
            className={`tab-button ${screen === "battle" ? "active" : ""}`}
            onClick={() => setScreen("battle")}
            disabled={!battleState}
          >
            Battle
          </button>
          <button
            type="button"
            className={`tab-button ${screen === "dashboard" ? "active" : ""}`}
            onClick={() => setScreen("dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`tab-button ${screen === "battleboard" ? "active" : ""}`}
            onClick={() => setScreen("battleboard")}
            disabled={!battleState}
          >
            Battle Board
          </button>
        </div>
      </section>

      {storageError ? <p className="panel storage-warning">{storageError}</p> : null}

      {isLoadingState ? (
        <section className="panel loading-panel">
          <h2>Loading saved rosters</h2>
          <p className="intro">Reading locally stored army data and member cards.</p>
        </section>
      ) : null}

      {!isLoadingState && screen === "builder" ? (
        <BuilderPage
          armyId={armyId}
          onChangeArmyId={handleArmySelectionChange}
          armyName={armyName}
          setArmyName={setArmyName}
          armyNotes={armyNotes}
          setArmyNotes={setArmyNotes}
          memberName={memberName}
          setMemberName={setMemberName}
          memberNotes={memberNotes}
          setMemberNotes={setMemberNotes}
          memberLoadout={memberLoadout}
          setMemberLoadout={setMemberLoadout}
          cardFile={cardFile}
          setCardFile={setCardFile}
          cardFile2={cardFile2}
          setCardFile2={setCardFile2}
          members={members}
          operativeAvailability={operativeAvailability}
          error={error}
          saveArmyMessage={saveArmyMessage}
          saving={saving}
          selectedArmy={selectedArmy}
          selectedOperative={selectedOperative}
          selectedTacOpIds={selectedTacOpIds}
          onToggleTacOp={(id) => setSelectedTacOpIds((current) => current.includes(id) ? current.filter((e) => e !== id) : [...current, id])}
          onAddMember={handleAddMember}
          onRemoveMember={removeMember}
          onClearRoster={clearRoster}
          onSaveArmy={handleSaveArmy}
          onGoToOverview={() => setScreen("overview")}
          isEditingArmy={!!editingArmyId}
        />
      ) : null}

      {!isLoadingState && screen === "overview" ? (
        <OverviewPage
          formattedSavedArmies={formattedSavedArmies}
          selectedOverviewArmyIds={selectedOverviewArmyIds}
          selectedOverviewArmies={selectedOverviewArmies}
          onToggleSelection={toggleOverviewArmySelection}
          onDeleteArmy={deleteSavedArmy}
          onStartNewArmy={startNewArmy}
          onLaunchBattle={launchBattle}
          hasBuilderData={members.length > 0 || armyName.trim() !== ""}
        />
      ) : null}

      {!isLoadingState && screen === "battle" ? (
        <BattlePage
          battleState={battleState}
          onUpdateTurn={updateBattleTurn}
          onUpdateCounter={updateBattleArmyCounter}
          onUpdateWounds={updateBattleMemberWounds}
          onUpdateMemberState={updateBattleMemberState}
          onResetBattle={resetBattle}
          onEndBattle={endBattle}
          onGoToOverview={() => setScreen("overview")}
        />
      ) : null}

      {!isLoadingState && screen === "dashboard" ? (
        <DashboardPage
          formattedSavedArmies={formattedSavedArmies}
          selectedOverviewArmyIds={selectedOverviewArmyIds}
          selectedOverviewArmies={selectedOverviewArmies}
          onToggleSelection={toggleOverviewArmySelection}
          onDeleteArmy={deleteSavedArmy}
          onLaunchBattle={launchBattle}
          onEditArmy={handleEditArmy}
          battleState={battleState}
          dashboardLayout={dashboardLayout}
          onUpdateDashboardLayout={setDashboardLayout}
        />
      ) : null}

      {!isLoadingState && screen === "battleboard" ? (
        <BattleDashboardPage
          battleState={battleState}
          onUpdateTurn={updateBattleTurn}
          onUpdateCounter={updateBattleArmyCounter}
          onUpdateWounds={updateBattleMemberWounds}
          onUpdateMemberState={updateBattleMemberState}
          onResetBattle={resetBattle}
          onEndBattle={() => setScreen("overview")}
          onGoToOverview={() => setScreen("overview")}
          battleDashboardLayout={battleDashboardLayout}
          onUpdateBattleDashboardLayout={setBattleDashboardLayout}
        />
      ) : null}
    </main>
  );
}
