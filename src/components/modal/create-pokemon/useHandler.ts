"use client";

import { useState, useCallback } from "react";
import {
  pokemonService,
  type CreatePokemonConflictsDto,
  type PokemonDto,
} from "@/lib/api/pokemon.service";
import { HttpError } from "@/lib/api/http-client";
import { validateSpriteUpload } from "@/lib/utils/file-upload";

export const NONE_TYPE = "none";

export const initialForm = {
  name: "",
  primaryType: "normal",
  secondaryType: NONE_TYPE,
  level: "1",
  hp: "45",
  pokedexId: "",
  baseAttack: "50",
  baseDefense: "50",
  baseSpeed: "50",
};

export type CreatePokemonForm = typeof initialForm;

export function useCreatePokemonHandler(
  onSuccess?: (created?: PokemonDto) => void,
  onClose?: () => void
) {
  const [form, setForm] = useState(initialForm);
  const [spriteFile, setSpriteFile] = useState<File | null>(null);
  const [spriteError, setSpriteError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<CreatePokemonConflictsDto | null>(null);

  const setField = useCallback((field: string, value: string) => {
    setError(null);
    setConflicts(null);
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSpriteChange = useCallback(async (file: File | null) => {
    setSpriteError(null);
    if (!file) {
      setSpriteFile(null);
      return;
    }
    const result = await validateSpriteUpload(file);
    if (result.valid) {
      setSpriteFile(result.file);
    } else {
      setSpriteError(result.error);
      setSpriteFile(null);
      return { clearInput: true };
    }
  }, []);

  const clearSprite = useCallback(() => {
    setSpriteFile(null);
    setSpriteError(null);
  }, []);

  const resetAfterSuccess = useCallback(() => {
    setSuccess(false);
    setForm(initialForm);
    clearSprite();
    onClose?.();
  }, [clearSprite, onClose]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading || success) return;

      const pokedexId = parseInt(form.pokedexId, 10);
      if (!form.pokedexId || isNaN(pokedexId) || pokedexId <= 0) {
        setError("Informe um número válido da Pokédex.");
        return;
      }

      if (!spriteFile) {
        setSpriteError("Select an image for the sprite.");
        return;
      }

      const validation = await validateSpriteUpload(spriteFile);
      if (!validation.valid) {
        setSpriteError(validation.error);
        return;
      }

      const types =
        form.secondaryType !== NONE_TYPE
          ? [form.primaryType, form.secondaryType]
          : [form.primaryType];

      const hp = parseInt(form.hp, 10);
      const level = parseInt(form.level, 10);
      const baseAttack = parseInt(form.baseAttack, 10);
      const baseDefense = parseInt(form.baseDefense, 10);
      const baseSpeed = parseInt(form.baseSpeed, 10);

      if (isNaN(baseAttack) || baseAttack < 1 || baseAttack > 255) {
        setError("Attack must be between 1 and 255.");
        return;
      }
      if (isNaN(baseDefense) || baseDefense < 1 || baseDefense > 255) {
        setError("Defense must be between 1 and 255.");
        return;
      }
      if (isNaN(baseSpeed) || baseSpeed < 1 || baseSpeed > 255) {
        setError("Speed must be between 1 and 255.");
        return;
      }

      setLoading(true);
      setError(null);
      setSpriteError(null);
      setConflicts(null);

      try {
        const response = await pokemonService.create({
          name: form.name,
          types,
          id: pokedexId,
          level,
          hp,
          currentHp: hp,
          baseAttack,
          baseDefense,
          baseSpeed,
          sprite: validation.file,
        });

        setSuccess(true);
        onSuccess?.(response.pokemon);

        setTimeout(() => {
          resetAfterSuccess();
        }, 1500);
      } catch (err: unknown) {
        if (err instanceof HttpError && err.apiError.conflicts) {
          const conflictData = err.apiError.conflicts as CreatePokemonConflictsDto;
          setConflicts(conflictData);
          setError(err.apiError.message);
        } else {
          const message =
            err instanceof Error ? err.message : "Erro ao criar o Pokémon. Tente novamente.";
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      form,
      loading,
      success,
      spriteFile,
      onSuccess,
      resetAfterSuccess,
    ]
  );

  const handleClose = useCallback(() => {
    setConflicts(null);
    onClose?.();
  }, [onClose]);

  return {
    form,
    setField,
    spriteFile,
    spriteError,
    handleSpriteChange,
    clearSprite,
    loading,
    success,
    error,
    conflicts,
    handleSubmit,
    handleClose,
  };
}
