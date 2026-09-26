window.RESEARCH_DATA = {
  "tasks": [
    {
      "id": "pusht",
      "name": "PushT",
      "cases": [
        {
          "id": "pusht-005",
          "distance": 75,
          "fps": 20,
          "episode": 675,
          "start": 74,
          "trainingSeed": 0,
          "evaluationSeed": 0,
          "category": "direct",
          "goal": "media/pusht-005-goal.png",
          "description": "FlexiWorld Direct succeeds; both INTACT variants fail.",
          "methods": [
            {
              "id": "direct",
              "label": "FlexiWorld Direct",
              "video": "media/pusht-005-direct.mp4",
              "poster": "media/pusht-005-direct-start.png",
              "firstSuccess": false,
              "success": true
            },
            {
              "id": "arcem",
              "label": "FlexiWorld ARCEM",
              "video": "media/pusht-005-arcem.mp4",
              "poster": "media/pusht-005-arcem-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "intact-direct",
              "label": "INTACT Direct",
              "video": "media/pusht-005-intact-direct.mp4",
              "poster": "media/pusht-005-intact-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "guarded",
              "label": "INTACT Guarded-A",
              "video": "media/pusht-005-guarded.mp4",
              "poster": "media/pusht-005-guarded-start.png",
              "firstSuccess": false,
              "success": false
            }
          ],
          "expert": {
            "video": "media/pusht-005-expert.mp4",
            "poster": "media/pusht-005-expert-start.png"
          }
        },
        {
          "id": "pusht-013",
          "distance": 75,
          "fps": 20,
          "episode": 1764,
          "start": 5,
          "trainingSeed": 0,
          "evaluationSeed": 0,
          "category": "direct",
          "goal": "media/pusht-013-goal.png",
          "description": "FlexiWorld Direct succeeds; both INTACT variants fail.",
          "methods": [
            {
              "id": "direct",
              "label": "FlexiWorld Direct",
              "video": "media/pusht-013-direct.mp4",
              "poster": "media/pusht-013-direct-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "arcem",
              "label": "FlexiWorld ARCEM",
              "video": "media/pusht-013-arcem.mp4",
              "poster": "media/pusht-013-arcem-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "intact-direct",
              "label": "INTACT Direct",
              "video": "media/pusht-013-intact-direct.mp4",
              "poster": "media/pusht-013-intact-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "guarded",
              "label": "INTACT Guarded-A",
              "video": "media/pusht-013-guarded.mp4",
              "poster": "media/pusht-013-guarded-start.png",
              "firstSuccess": false,
              "success": false
            }
          ],
          "expert": {
            "video": "media/pusht-013-expert.mp4",
            "poster": "media/pusht-013-expert-start.png"
          }
        },
        {
          "id": "pusht-000",
          "distance": 75,
          "fps": 20,
          "episode": 76,
          "start": 18,
          "trainingSeed": 0,
          "evaluationSeed": 0,
          "category": "search",
          "goal": "media/pusht-000-goal.png",
          "description": "ARCEM succeeds where Direct and both INTACT variants fail.",
          "methods": [
            {
              "id": "direct",
              "label": "FlexiWorld Direct",
              "video": "media/pusht-000-direct.mp4",
              "poster": "media/pusht-000-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "arcem",
              "label": "FlexiWorld ARCEM",
              "video": "media/pusht-000-arcem.mp4",
              "poster": "media/pusht-000-arcem-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "intact-direct",
              "label": "INTACT Direct",
              "video": "media/pusht-000-intact-direct.mp4",
              "poster": "media/pusht-000-intact-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "guarded",
              "label": "INTACT Guarded-A",
              "video": "media/pusht-000-guarded.mp4",
              "poster": "media/pusht-000-guarded-start.png",
              "firstSuccess": false,
              "success": false
            }
          ],
          "expert": {
            "video": "media/pusht-000-expert.mp4",
            "poster": "media/pusht-000-expert-start.png"
          }
        }
      ]
    },
    {
      "id": "cube",
      "name": "Cube",
      "cases": [
        {
          "id": "cube-019",
          "distance": 75,
          "fps": 20,
          "episode": 2546,
          "start": 3,
          "trainingSeed": 0,
          "evaluationSeed": 0,
          "category": "direct",
          "goal": "media/cube-019-goal.png",
          "description": "FlexiWorld Direct succeeds; both INTACT variants fail.",
          "methods": [
            {
              "id": "direct",
              "label": "FlexiWorld Direct",
              "video": "media/cube-019-direct.mp4",
              "poster": "media/cube-019-direct-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "arcem",
              "label": "FlexiWorld ARCEM",
              "video": "media/cube-019-arcem.mp4",
              "poster": "media/cube-019-arcem-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "intact-direct",
              "label": "INTACT Direct",
              "video": "media/cube-019-intact-direct.mp4",
              "poster": "media/cube-019-intact-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "guarded",
              "label": "INTACT Guarded-A",
              "video": "media/cube-019-guarded.mp4",
              "poster": "media/cube-019-guarded-start.png",
              "firstSuccess": false,
              "success": false
            }
          ],
          "expert": {
            "video": "media/cube-019-expert.mp4",
            "poster": "media/cube-019-expert-start.png"
          }
        },
        {
          "id": "cube-025",
          "distance": 75,
          "fps": 20,
          "episode": 3078,
          "start": 7,
          "trainingSeed": 0,
          "evaluationSeed": 0,
          "category": "direct",
          "goal": "media/cube-025-goal.png",
          "description": "FlexiWorld Direct succeeds; both INTACT variants fail.",
          "methods": [
            {
              "id": "direct",
              "label": "FlexiWorld Direct",
              "video": "media/cube-025-direct.mp4",
              "poster": "media/cube-025-direct-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "arcem",
              "label": "FlexiWorld ARCEM",
              "video": "media/cube-025-arcem.mp4",
              "poster": "media/cube-025-arcem-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "intact-direct",
              "label": "INTACT Direct",
              "video": "media/cube-025-intact-direct.mp4",
              "poster": "media/cube-025-intact-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "guarded",
              "label": "INTACT Guarded-A",
              "video": "media/cube-025-guarded.mp4",
              "poster": "media/cube-025-guarded-start.png",
              "firstSuccess": false,
              "success": false
            }
          ],
          "expert": {
            "video": "media/cube-025-expert.mp4",
            "poster": "media/cube-025-expert-start.png"
          }
        },
        {
          "id": "cube-017",
          "distance": 75,
          "fps": 20,
          "episode": 1756,
          "start": 57,
          "trainingSeed": 0,
          "evaluationSeed": 0,
          "category": "search",
          "goal": "media/cube-017-goal.png",
          "description": "ARCEM succeeds where Direct and both INTACT variants fail.",
          "methods": [
            {
              "id": "direct",
              "label": "FlexiWorld Direct",
              "video": "media/cube-017-direct.mp4",
              "poster": "media/cube-017-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "arcem",
              "label": "FlexiWorld ARCEM",
              "video": "media/cube-017-arcem.mp4",
              "poster": "media/cube-017-arcem-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "intact-direct",
              "label": "INTACT Direct",
              "video": "media/cube-017-intact-direct.mp4",
              "poster": "media/cube-017-intact-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "guarded",
              "label": "INTACT Guarded-A",
              "video": "media/cube-017-guarded.mp4",
              "poster": "media/cube-017-guarded-start.png",
              "firstSuccess": false,
              "success": false
            }
          ],
          "expert": {
            "video": "media/cube-017-expert.mp4",
            "poster": "media/cube-017-expert-start.png"
          }
        }
      ]
    },
    {
      "id": "reacher",
      "name": "Reacher",
      "cases": [
        {
          "id": "reacher-029",
          "distance": 100,
          "fps": 20,
          "episode": 3379,
          "start": 6,
          "trainingSeed": 0,
          "evaluationSeed": 0,
          "category": "direct",
          "goal": "media/reacher-029-goal.png",
          "description": "FlexiWorld Direct succeeds; both INTACT variants fail.",
          "methods": [
            {
              "id": "direct",
              "label": "FlexiWorld Direct",
              "video": "media/reacher-029-direct.mp4",
              "poster": "media/reacher-029-direct-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "arcem",
              "label": "FlexiWorld ARCEM",
              "video": "media/reacher-029-arcem.mp4",
              "poster": "media/reacher-029-arcem-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "intact-direct",
              "label": "INTACT Direct",
              "video": "media/reacher-029-intact-direct.mp4",
              "poster": "media/reacher-029-intact-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "guarded",
              "label": "INTACT Guarded-A",
              "video": "media/reacher-029-guarded.mp4",
              "poster": "media/reacher-029-guarded-start.png",
              "firstSuccess": false,
              "success": false
            }
          ],
          "expert": {
            "video": "media/reacher-029-expert.mp4",
            "poster": "media/reacher-029-expert-start.png"
          }
        },
        {
          "id": "reacher-046",
          "distance": 100,
          "fps": 20,
          "episode": 5110,
          "start": 87,
          "trainingSeed": 0,
          "evaluationSeed": 0,
          "category": "direct",
          "goal": "media/reacher-046-goal.png",
          "description": "FlexiWorld Direct succeeds; both INTACT variants fail.",
          "methods": [
            {
              "id": "direct",
              "label": "FlexiWorld Direct",
              "video": "media/reacher-046-direct.mp4",
              "poster": "media/reacher-046-direct-start.png",
              "firstSuccess": false,
              "success": true
            },
            {
              "id": "arcem",
              "label": "FlexiWorld ARCEM",
              "video": "media/reacher-046-arcem.mp4",
              "poster": "media/reacher-046-arcem-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "intact-direct",
              "label": "INTACT Direct",
              "video": "media/reacher-046-intact-direct.mp4",
              "poster": "media/reacher-046-intact-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "guarded",
              "label": "INTACT Guarded-A",
              "video": "media/reacher-046-guarded.mp4",
              "poster": "media/reacher-046-guarded-start.png",
              "firstSuccess": false,
              "success": false
            }
          ],
          "expert": {
            "video": "media/reacher-046-expert.mp4",
            "poster": "media/reacher-046-expert-start.png"
          }
        }
      ]
    },
    {
      "id": "tworoom",
      "name": "TwoRoom",
      "cases": [
        {
          "id": "tworoom-083",
          "distance": 75,
          "fps": 20,
          "episode": 8352,
          "start": 5,
          "trainingSeed": 0,
          "evaluationSeed": 0,
          "category": "direct",
          "goal": "media/tworoom-083-goal.png",
          "description": "FlexiWorld Direct succeeds; both INTACT variants fail.",
          "methods": [
            {
              "id": "direct",
              "label": "FlexiWorld Direct",
              "video": "media/tworoom-083-direct.mp4",
              "poster": "media/tworoom-083-direct-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "arcem",
              "label": "FlexiWorld ARCEM",
              "video": "media/tworoom-083-arcem.mp4",
              "poster": "media/tworoom-083-arcem-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "intact-direct",
              "label": "INTACT Direct",
              "video": "media/tworoom-083-intact-direct.mp4",
              "poster": "media/tworoom-083-intact-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "guarded",
              "label": "INTACT Guarded-A",
              "video": "media/tworoom-083-guarded.mp4",
              "poster": "media/tworoom-083-guarded-start.png",
              "firstSuccess": false,
              "success": false
            }
          ],
          "expert": {
            "video": "media/tworoom-083-expert.mp4",
            "poster": "media/tworoom-083-expert-start.png"
          }
        },
        {
          "id": "tworoom-041",
          "distance": 75,
          "fps": 20,
          "episode": 4629,
          "start": 15,
          "trainingSeed": 0,
          "evaluationSeed": 0,
          "category": "search",
          "goal": "media/tworoom-041-goal.png",
          "description": "ARCEM succeeds where Direct and both INTACT variants fail.",
          "methods": [
            {
              "id": "direct",
              "label": "FlexiWorld Direct",
              "video": "media/tworoom-041-direct.mp4",
              "poster": "media/tworoom-041-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "arcem",
              "label": "FlexiWorld ARCEM",
              "video": "media/tworoom-041-arcem.mp4",
              "poster": "media/tworoom-041-arcem-start.png",
              "firstSuccess": true,
              "success": true
            },
            {
              "id": "intact-direct",
              "label": "INTACT Direct",
              "video": "media/tworoom-041-intact-direct.mp4",
              "poster": "media/tworoom-041-intact-direct-start.png",
              "firstSuccess": false,
              "success": false
            },
            {
              "id": "guarded",
              "label": "INTACT Guarded-A",
              "video": "media/tworoom-041-guarded.mp4",
              "poster": "media/tworoom-041-guarded-start.png",
              "firstSuccess": false,
              "success": false
            }
          ],
          "expert": {
            "video": "media/tworoom-041-expert.mp4",
            "poster": "media/tworoom-041-expert-start.png"
          }
        }
      ]
    }
  ],
  "results": [
    {
      "label": "LeWM",
      "values": [
        {
          "mean": 33.83,
          "sd": 0.52
        },
        {
          "mean": 51.67,
          "sd": 2.31
        },
        {
          "mean": 72.08,
          "sd": 1.66
        },
        {
          "mean": 47.83,
          "sd": 0.72
        },
        {
          "mean": 51.35,
          "sd": 0.88
        }
      ]
    },
    {
      "label": "Fast-LeWM",
      "values": [
        {
          "mean": 42.42,
          "sd": 2.04
        },
        {
          "mean": 55.33,
          "sd": 3.82
        },
        {
          "mean": 73.17,
          "sd": 1.53
        },
        {
          "mean": 62.83,
          "sd": 1.46
        },
        {
          "mean": 58.44,
          "sd": 1.67
        }
      ]
    },
    {
      "label": "Sub-JEPA",
      "values": [
        {
          "mean": 40.58,
          "sd": 1.26
        },
        {
          "mean": 54.33,
          "sd": 3.76
        },
        {
          "mean": 74.67,
          "sd": 1.77
        },
        {
          "mean": 55,
          "sd": 1.75
        },
        {
          "mean": 56.15,
          "sd": 1.51
        }
      ]
    },
    {
      "label": "DINO-WM",
      "values": [
        {
          "mean": 39.08,
          "sd": 0.38
        },
        {
          "mean": 55.83,
          "sd": 3.84
        },
        {
          "mean": 66.83,
          "sd": 4.38
        },
        {
          "mean": 90.83,
          "sd": 0.29
        },
        {
          "mean": 63.15,
          "sd": 0.59
        }
      ]
    },
    {
      "label": "INTACT",
      "values": [
        {
          "mean": 55.17,
          "sd": 1.63
        },
        {
          "mean": 84.58,
          "sd": 2.18
        },
        {
          "mean": 98.42,
          "sd": 0.52
        },
        {
          "mean": 97.75,
          "sd": 0.75
        },
        {
          "mean": 83.98,
          "sd": 0.96
        }
      ]
    },
    {
      "label": "FlexiWorld",
      "values": [
        {
          "mean": 68.89,
          "sd": 4.8
        },
        {
          "mean": 91.94,
          "sd": 1.5
        },
        {
          "mean": 99.72,
          "sd": 0.17
        },
        {
          "mean": 96.61,
          "sd": 2.45
        },
        {
          "mean": 89.29,
          "sd": 1.96
        }
      ]
    }
  ],
  "planners": [
    {
      "label": "FlexiWorld Direct",
      "values": [
        {
          "mean": 60.39,
          "sd": 3.92
        },
        {
          "mean": 91.36,
          "sd": 1.56
        },
        {
          "mean": 99.06,
          "sd": 0.05
        },
        {
          "mean": 96.36,
          "sd": 1.92
        },
        {
          "mean": 86.79,
          "sd": 1.65
        }
      ]
    },
    {
      "label": "FlexiWorld Guarded-A",
      "values": [
        {
          "mean": 65.64,
          "sd": 5.22
        },
        {
          "mean": 90.69,
          "sd": 2.18
        },
        {
          "mean": 97.83,
          "sd": 0.51
        },
        {
          "mean": 97.53,
          "sd": 1.89
        },
        {
          "mean": 87.92,
          "sd": 2.26
        }
      ]
    },
    {
      "label": "FlexiWorld ARCEM",
      "values": [
        {
          "mean": 68.89,
          "sd": 4.8
        },
        {
          "mean": 91.94,
          "sd": 1.5
        },
        {
          "mean": 99.72,
          "sd": 0.17
        },
        {
          "mean": 96.61,
          "sd": 2.45
        },
        {
          "mean": 89.29,
          "sd": 1.96
        }
      ]
    }
  ],
  "latency": [
    {
      "distance": 25,
      "sr5": 98.56,
      "sr10": 98.86,
      "ms5": 268.8,
      "ms10": 221.5
    },
    {
      "distance": 50,
      "sr5": 91.39,
      "sr10": 90.75,
      "ms5": 510.9,
      "ms10": 393.6
    },
    {
      "distance": 75,
      "sr5": 84.25,
      "sr10": 85.11,
      "ms5": 753.3,
      "ms10": 588.1
    },
    {
      "distance": 100,
      "sr5": 82.75,
      "sr10": 81.94,
      "ms5": 994.4,
      "ms10": 760.1
    }
  ],
  "protocol": {
    "distances": [
      25,
      50,
      75,
      100
    ],
    "trainingSeeds": [
      0,
      42,
      3072
    ],
    "evaluationSeeds": [
      0,
      1,
      42
    ],
    "episodesPerCell": 100,
    "baselineTrainingCheckpoints": 1
  },
  "provenance": {
    "manuscriptCommit": "96ab3cb31828791322b7a3b96fd99df224ce19b7"
  }
};
