export type DelegateType = 'ambitus_student' | 'external_delegate'

export interface CommitteePreference {
  id: string
  name: string
  description: string
  agenda: string
}

export interface RegistrationData {
  full_name: string
  email: string
  phone: string
  institution: string
  delegate_type: DelegateType
  experience: string
  preference_1: string
  preference_2: string
  preference_3: string
}

export const COMMITTEES: CommitteePreference[] = [
  {
    id: 'unhrc',
    name: 'UN Human Rights Council (UNHRC)',
    description: 'The UNHRC is an inter-governmental body responsible for strengthening the promotion and protection of human rights around the globe.',
    agenda: 'Addressing Human Rights Violations in Conflict Zones',
  },
  {
    id: 'unsc',
    name: 'UN Security Council (UNSC)',
    description: 'The UNSC is the most powerful UN body, responsible for maintaining international peace and security.',
    agenda: 'Nuclear Non-Proliferation in the Middle East',
  },
  {
    id: 'unep',
    name: 'UN Environment Programme (UNEP)',
    description: 'UNEP coordinates environmental activities and assists developing countries in implementing environmentally sound policies.',
    agenda: 'Combating Plastic Pollution in Oceans',
  },
  {
    id: 'disec',
    name: 'UN General Assembly — DISEC',
    description: 'The First Committee of the UNGA deals with disarmament, global challenges, and threats to peace.',
    agenda: 'Regulating Autonomous Weapons Systems',
  },
  {
    id: 'who',
    name: 'World Health Organization (WHO)',
    description: 'WHO is the directing and coordinating authority on international health within the UN system.',
    agenda: 'Global Pandemic Preparedness and Response',
  },
  {
    id: 'aippm',
    name: 'All India Political Party Meet (AIPPM)',
    description: 'A dynamic committee simulating Indian political leaders debating national issues.',
    agenda: 'Electoral Reforms in India',
  },
  {
    id: 'ip',
    name: 'International Press (IP)',
    description: 'Reporters who cover the conference, write articles, and hold delegates accountable through journalism.',
    agenda: 'Journalism and Reporting',
  },
]
