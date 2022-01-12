<template>
    <div class="container-contenido d-flex">
        <div class="tabs-container">
            <div class="tabs-item" >
                HOME
            </div>
        </div>
        <Component style="width:100%;" :is="currentTab"/>

    <form
        id="app"
        @submit="checkForm"
        action="https://vuejs.org/"
        method="post"
    >

  <p>
    <label for="name">Nombre</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="age">Edad</label>
    <input
      id="age"
      v-model="age"
      type="number"
      name="age"
      min="0">
  </p>

  <p>
    <label for="movie">Película favorita</label>
    <select
      id="movie"
      v-model="movie"
      name="movie"
    >
      <option>Star Wars</option>
      <option>Vanilla Sky</option>
      <option>Atomic Blonde</option>
    </select>
  </p>

  <p>
    <input
      type="submit"
      value="Enviar"
    >
  </p>

    </form>
        
    </div>
</template>

<script>

</script>