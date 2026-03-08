"use client";

import { useState, useCallback, useEffect } from "react";
import {
  pokemonService,
  type CreatePokemonConflictsDto,
} from "@/lib/api/pokemon.service";
import { HttpError } from "@/lib/api/http-client";
import type { PokemonDetail } from "@/components/pages/pokemon-detail/types";
import { NONE_TYPE } from "@/components/modal/create-pokemon/useHandler";

export type EditPokemonForm = {
  name: string;
  hp: string;
  primaryType: string;
  secondaryType: string;
  level: string;
  pokedexId: string;
};

function initialFormFromPokemon(pokemon: PokemonDetail): EditPokemonForm {
  const [primary = "normal", secondary] = pokemon.types;
  return {
    name: pokemon.name,
    hp: String(pokemon.hp),
    primaryType: primary,
    secondaryType: secondary ?? NONE_TYPE,
    level: String(pokemon.level),
    pokedexId: String(pokemon.id),
  };
}

export function useEditPokemonHandler(
  pokemon: PokemonDetail | null,
  onSuccess?: () => void,
  onClose?: () => void
) {
  const [form, setForm] = useState<EditPokemonForm>({
    name: "",
    hp: "1",
    primaryType: "normal",
    secondaryType: NONE_TYPE,
    level: "1",
    pokedexId: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<CreatePokemonConflictsDto | null>(null);

  useEffect(() => {
    if (pokemon) {
      setForm(initialFormFromPokemon(pokemon));
      setError(null);
      setConflicts(null);
    }
  }, [pokemon]);

  const setField = useCallback((field: keyof EditPokemonForm, value: string) => {
    setError(null);
    setConflicts(null);
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!pokemon || loading || success) return;

      const pokedexId = parseInt(form.pokedexId, 10);
      if (!form.pokedexId.trim() || isNaN(pokedexId) || pokedexId <= 0) {
        setError("Informe um número válido da Pokédex.");
        return;
      }

      const hp = parseInt(form.hp, 10);
      const level = parseInt(form.level, 10);
      if (isNaN(hp) || hp < 1 || hp > 255) {
        setError("HP deve estar entre 1 e 255.");
        return;
      }
      if (isNaN(level) || level < 1 || level > 100) {
        setError("Nível deve estar entre 1 e 100.");
        return;
      }

      const types =
        form.secondaryType !== NONE_TYPE
          ? [form.primaryType, form.secondaryType]
          : [form.primaryType];

      setLoading(true);
      setError(null);
      setConflicts(null);

      try {
        await pokemonService.update(pokemon.id, {
          name: form.name.trim(),
          hp,
          types,
          level,
          id: pokedexId,
        });
        setSuccess(true);
        onSuccess?.();
        setTimeout(() => {
          setSuccess(false);
          onClose?.();
        }, 1500);
      } catch (err: unknown) {
        if (err instanceof HttpError && err.apiError.conflicts) {
          const conflictData = err.apiError.conflicts as CreatePokemonConflictsDto;
          setConflicts(conflictData);
          setError(err.apiError.message);
        } else {
          const message =
            err instanceof Error ? err.message : "Erro ao atualizar o Pokémon. Tente novamente.";
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    },
    [pokemon, form, loading, success, onSuccess, onClose]
  );

  const handleClose = useCallback(() => {
    setConflicts(null);
    setError(null);
    onClose?.();
  }, [onClose]);

  return {
    form,
    setField,
    loading,
    success,
    error,
    conflicts,
    handleSubmit,
    handleClose,
  };
}
