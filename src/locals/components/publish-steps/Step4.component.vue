<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  country: String,
  city: String,
  district: String,
  street: String,
});

const emit = defineEmits([
  'update:country',
  'update:city',
  'update:district',
  'update:street'
]);

// Departamentos y distritos de Perú
const peruData = {
  'Lima': [
    'Miraflores', 'San Isidro', 'Barranco', 'Surco', 'La Molina',
    'San Borja', 'Jesús María', 'Lince', 'Magdalena', 'Pueblo Libre',
    'San Miguel', 'Breña', 'Lima Cercado', 'Rímac', 'La Victoria',
    'Ate', 'Santa Anita', 'El Agustino', 'San Juan de Lurigancho',
    'Comas', 'Los Olivos', 'San Martín de Porres', 'Independencia',
    'Chorrillos', 'Villa El Salvador', 'Villa María del Triunfo',
    'San Juan de Miraflores', 'Lurín', 'Pachacámac', 'Cieneguilla',
    'Chaclacayo', 'Chosica', 'Punta Hermosa', 'Punta Negra', 'San Bartolo',
    'Santa María del Mar', 'Pucusana', 'Ancón', 'Santa Rosa', 'Carabayllo', 'Puente Piedra'
  ],
  'Arequipa': [
    'Arequipa', 'Alto Selva Alegre', 'Cayma', 'Cerro Colorado',
    'Characato', 'Chiguata', 'Jacobo Hunter', 'La Joya', 'Mariano Melgar',
    'Miraflores', 'Mollebaya', 'Paucarpata', 'Pocsi', 'Polobaya',
    'Quequeña', 'Sabandía', 'Sachaca', 'San Juan de Siguas',
    'San Juan de Tarucani', 'Santa Isabel de Siguas', 'Santa Rita de Siguas',
    'Socabaya', 'Tiabaya', 'Uchumayo', 'Vítor', 'Yanahuara', 'Yarabamba', 'Yura'
  ],
  'Cusco': [
    'Cusco', 'Ccorca', 'Poroy', 'San Jerónimo', 'San Sebastián',
    'Santiago', 'Saylla', 'Wanchaq', 'Calca', 'Urubamba', 'Ollantaytambo',
    'Pisac', 'Chinchero', 'Machu Picchu', 'Aguas Calientes'
  ],
  'La Libertad': [
    'Trujillo', 'El Porvenir', 'Florencia de Mora', 'Huanchaco',
    'La Esperanza', 'Laredo', 'Moche', 'Poroto', 'Salaverry',
    'Simbal', 'Víctor Larco Herrera'
  ],
  'Piura': [
    'Piura', 'Castilla', 'Catacaos', 'Cura Mori', 'El Tallán',
    'La Arena', 'La Unión', 'Las Lomas', 'Tambo Grande', 'Sullana',
    'Talara', 'Paita', 'Sechura', 'Máncora', 'Los Órganos'
  ],
  'Lambayeque': [
    'Chiclayo', 'Chongoyape', 'Eten', 'Eten Puerto', 'José Leonardo Ortiz',
    'La Victoria', 'Lagunas', 'Monsefú', 'Nueva Arica', 'Oyotún',
    'Picsi', 'Pimentel', 'Reque', 'Santa Rosa', 'Saña', 'Cayaltí',
    'Pátapo', 'Pomalca', 'Pucalá', 'Tumán', 'Lambayeque', 'Ferreñafe'
  ],
  'Ica': [
    'Ica', 'La Tinguiña', 'Los Aquijes', 'Ocucaje', 'Pachacútec',
    'Parcona', 'Pueblo Nuevo', 'Salas', 'San José de Los Molinos',
    'San Juan Bautista', 'Santiago', 'Subtanjalla', 'Tate', 'Yauca del Rosario',
    'Chincha Alta', 'Pisco', 'Nazca', 'Palpa'
  ],
  'Junín': [
    'Huancayo', 'Carhuacallanga', 'Chacapampa', 'Chicche', 'Chilca',
    'Chongos Alto', 'Chupuro', 'Colca', 'Cullhuas', 'El Tambo',
    'Huacrapuquio', 'Hualhuas', 'Huancán', 'Huasicancha', 'Huayucachi',
    'Ingenio', 'Pariahuanca', 'Pilcomayo', 'Pucará', 'Quichuay',
    'Quilcas', 'San Agustín', 'San Jerónimo de Tunán', 'Saño',
    'Sapallanga', 'Sicaya', 'Santo Domingo de Acobamba', 'Viques'
  ],
  'Áncash': [
    'Huaraz', 'Cochabamba', 'Colcabamba', 'Huanchay', 'Independencia',
    'Jangas', 'La Libertad', 'Olleros', 'Pampas Grande', 'Pariacoto',
    'Pira', 'Tarica', 'Chimbote', 'Coishco', 'Nuevo Chimbote', 'Santa'
  ],
  'Cajamarca': [
    'Cajamarca', 'Asunción', 'Chetilla', 'Cospan', 'Encañada',
    'Jesús', 'Llacanora', 'Los Baños del Inca', 'Magdalena',
    'Matara', 'Namora', 'San Juan', 'Jaén', 'Chota', 'Cutervo'
  ],
  'Puno': [
    'Puno', 'Acora', 'Amantani', 'Atuncolla', 'Capachica', 'Chucuito',
    'Coata', 'Huata', 'Mañazo', 'Paucarcolla', 'Pichacani', 'Platería',
    'San Antonio', 'Tiquillaca', 'Vilque', 'Juliaca', 'Ayaviri'
  ],
  'Tacna': [
    'Tacna', 'Alto de la Alianza', 'Calana', 'Ciudad Nueva',
    'Coronel Gregorio Albarracín Lanchipa', 'Inclán', 'Palca',
    'Pocollay', 'Sama', 'Tarata'
  ],
  'Loreto': [
    'Iquitos', 'Alto Nanay', 'Fernando Lores', 'Indiana', 'Las Amazonas',
    'Mazán', 'Napo', 'Punchana', 'Torres Causana', 'Belén', 'San Juan Bautista'
  ],
  'San Martín': [
    'Moyobamba', 'Calzada', 'Habana', 'Jepelacio', 'Soritor', 'Yantalo',
    'Tarapoto', 'Alberto Leveau', 'Cacatachi', 'Chazuta', 'Chipurana',
    'El Porvenir', 'Huimbayoc', 'Juan Guerra', 'La Banda de Shilcayo',
    'Morales', 'Papaplaya', 'San Antonio', 'Sauce', 'Shapaja'
  ],
  'Ucayali': [
    'Callería', 'Campoverde', 'Iparia', 'Masisea', 'Yarinacocha',
    'Nueva Requena', 'Manantay', 'Pucallpa'
  ],
  'Madre de Dios': [
    'Tambopata', 'Inambari', 'Las Piedras', 'Laberinto', 'Puerto Maldonado'
  ],
  'Tumbes': [
    'Tumbes', 'Corrales', 'La Cruz', 'Pampas de Hospital', 'San Jacinto', 'San Juan de la Virgen'
  ],
  'Moquegua': [
    'Moquegua', 'Carumas', 'Cuchumbaya', 'Samegua', 'San Cristóbal',
    'Torata', 'Ilo', 'El Algarrobal', 'Pacocha'
  ],
  'Amazonas': [
    'Chachapoyas', 'Asunción', 'Balsas', 'Cheto', 'Chiliquín',
    'Chuquibamba', 'Granada', 'Huancas', 'La Jalca', 'Leimebamba',
    'Levanto', 'Magdalena', 'Mariscal Castilla', 'Molinopampa',
    'Montevideo', 'Olleros', 'Quinjalca', 'San Francisco de Daguas',
    'San Isidro de Maino', 'Soloco', 'Sonche'
  ],
  'Ayacucho': [
    'Ayacucho', 'Acocro', 'Acos Vinchos', 'Carmen Alto', 'Chiara',
    'Ocros', 'Pacaycasa', 'Quinua', 'San José de Ticllas',
    'San Juan Bautista', 'Santiago de Pischa', 'Socos', 'Tambillo',
    'Vinchos', 'Jesús Nazareno', 'Andrés Avelino Cáceres Dorregaray'
  ],
  'Apurímac': [
    'Abancay', 'Chacoche', 'Circa', 'Curahuasi', 'Huanipaca',
    'Lambrama', 'Pichirhua', 'San Pedro de Cachora', 'Tamburco'
  ],
  'Huancavelica': [
    'Huancavelica', 'Acobambilla', 'Acoria', 'Conayca', 'Cuenca',
    'Huachocolpa', 'Huayllahuara', 'Izcuchaca', 'Laria', 'Manta',
    'Mariscal Cáceres', 'Moya', 'Nuevo Occoro', 'Palca', 'Pilchaca',
    'Vilca', 'Yauli', 'Ascensión'
  ],
  'Huánuco': [
    'Huánuco', 'Amarilis', 'Chinchao', 'Churubamba', 'Margos',
    'Quisqui', 'San Francisco de Cayrán', 'San Pedro de Chaulán',
    'Santa María del Valle', 'Yarumayo', 'Pillco Marca'
  ],
  'Pasco': [
    'Chaupimarca', 'Huachón', 'Huariaca', 'Huayllay', 'Ninacaca',
    'Pallanchacra', 'Paucartambo', 'San Francisco de Asís de Yarusyacán',
    'Simón Bolívar', 'Ticlacayán', 'Tinyahuarco', 'Vicco', 'Yanacancha'
  ],
  'Callao': [
    'Callao', 'Bellavista', 'Carmen de la Legua Reynoso', 'La Perla',
    'La Punta', 'Ventanilla', 'Mi Perú'
  ]
};

const departments = Object.keys(peruData).sort();
const selectedDepartment = ref(props.city || '');
const selectedDistrict = ref(props.district || '');

const availableDistricts = computed(() => {
  if (selectedDepartment.value && peruData[selectedDepartment.value]) {
    return peruData[selectedDepartment.value].sort();
  }
  return [];
});

// Emitir el país como "Perú" al montar
onMounted(() => {
  emit('update:country', 'Perú');
});

// Watch para actualizar el departamento
watch(selectedDepartment, (newVal) => {
  emit('update:city', newVal);
  // Resetear distrito cuando cambia el departamento
  selectedDistrict.value = '';
  emit('update:district', '');
});

// Watch para actualizar el distrito
watch(selectedDistrict, (newVal) => {
  emit('update:district', newVal);
});

// Sincronizar con props
watch(() => props.city, (newVal) => {
  if (newVal !== selectedDepartment.value) {
    selectedDepartment.value = newVal || '';
  }
});

watch(() => props.district, (newVal) => {
  if (newVal !== selectedDistrict.value) {
    selectedDistrict.value = newVal || '';
  }
});
</script>

<template>
  <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step4.title') }}</h1>
  <p class="text-lg text-center text-(--text-color)">{{ t('publishSteps.step4.subtitle') }}</p>

  <!-- País (fijo Perú) -->
  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="country" class="bg-(--background-color) w-12 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step4.country') }}</label>
    <input
      type="text"
      id="country"
      value="Perú"
      disabled
      class="border border-gray-300 dark:border-gray-600 rounded px-4 py-4 text-(--text-color) bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
    />
  </div>

  <!-- Departamento (dropdown) -->
  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="department" class="bg-(--background-color) w-33 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step4.department') }}</label>
    <select
      id="department"
      v-model="selectedDepartment"
      class="border border-gray-300 dark:border-gray-600 rounded px-4 py-4 text-(--text-color) bg-(--background-color) cursor-pointer appearance-none"
    >
      <option value="" disabled>{{ t('publishSteps.step4.departmentPlaceholder') }}</option>
      <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
    </select>
  </div>

  <!-- Distrito (dropdown) -->
  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="district" class="bg-(--background-color) w-19 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step4.district') }}</label>
    <select
      id="district"
      v-model="selectedDistrict"
      :disabled="!selectedDepartment"
      class="border border-gray-300 dark:border-gray-600 rounded px-4 py-4 text-(--text-color) bg-(--background-color) cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="" disabled>{{ t('publishSteps.step4.districtPlaceholder') }}</option>
      <option v-for="dist in availableDistricts" :key="dist" :value="dist">{{ dist }}</option>
    </select>
  </div>

  <!-- Dirección (texto libre) -->
  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="street" class="bg-(--background-color) w-23 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step4.address') }}</label>
    <input
      type="text"
      id="street"
      :value="props.street"
      @input="emit('update:street', $event.target.value)"
      class="border border-gray-300 dark:border-gray-600 rounded px-4 py-4 text-(--text-color) bg-(--background-color)"
      :placeholder="t('publishSteps.step4.addressPlaceholder')"
    />
  </div>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
